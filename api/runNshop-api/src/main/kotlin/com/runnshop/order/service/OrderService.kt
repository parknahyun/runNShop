package com.runnshop.order.service

import com.runnshop.common.MockLoader
import com.runnshop.common.exception.BadRequestException
import com.runnshop.order.dto.OrderListResponse
import com.runnshop.order.dto.Pagination
import org.springframework.stereotype.Service
import kotlin.math.ceil

data class AdminOrderFilter(
    val keyword: String? = null,
    val status: String? = "ALL",
    val from: String? = null,
    val to: String? = null,
    val page: Int = 1,
    val size: Int = 10
)

data class PartnerOrderFilter(
    val keyword: String? = null,
    val status: String? = "ALL",
    val from: String? = null,
    val to: String? = null,
    val page: Int = 1,
    val size: Int = 10
)

/**
 * Order 도메인 조회(목록/상세) 비즈니스 로직.
 *
 * 목록 조회 메서드는 아래 4단계 구조를 따른다 (코딩 패턴 — DB 전환 시에도 유지):
 *  ① validation   — 입력 형식/범위를 명시적으로 검증한다 (조용한 보정 금지).
 *  ② mapper execute — 지금은 MockLoader가 전체 데이터셋을 로드하고 Service가 사후 필터링하지만,
 *      실제 쿼리는 list(목록)/count(건수)/summary(집계) 3개로 분리된다는 전제 위에서 메서드를 나눈다.
 *      - list: 공유조건(keyword+dateRange) + status 전용조건, ORDER BY + LIMIT/OFFSET
 *      - count: list와 동일 WHERE, LIMIT 없이 건수만
 *      - summary: 공유조건만 (status 제외), GROUP BY status — 목록 필터와 무관하게 전체 상태 분포를 보여주기 위함
 *  ③ dto convert   — Map 대신 OrderListResponse/Pagination DTO로 변환한다.
 * (DP-클래스설계/order.md 네이밍 준수)
 */
@Service
class OrderService(private val mockLoader: MockLoader) {

    private val adminStatusSummaryKeys = mapOf(
        "ORDER_RECEIVED" to "orderReceived",
        "PAYMENT_COMPLETED" to "paymentCompleted",
        "PREPARING" to "preparing",
        "IN_DELIVERY" to "inDelivery",
        "DELIVERED" to "delivered",
        "CONFIRMED" to "confirmed",
        "CANCELLED" to "cancelled"
    )

    /**
     * 어드민 주문 목록을 조회한다. (DL §15)
     * summary는 status를 제외한 조건(keyword+dateRange)으로 집계하고, 목록(list/count)은 status까지 포함한 조건으로 조회한다
     * — "상태별 요약 카드는 검색조건과 무관하게 전체 상태 분포를 보여주고, 목록만 선택한 상태로 좁힌다"는 의도된 설계.
     */
    fun getAdminOrders(filter: AdminOrderFilter): OrderListResponse {
        val page = validatePage(filter.page)
        val size = validateSize(filter.size)
        validateDateRange(filter.from, filter.to)

        val allOrders = loadAdminOrderDataset()
        val sharedFiltered = applySharedFilters(allOrders, filter.keyword, filter.from, filter.to)

        val summary = aggregateAdminSummary(sharedFiltered)
        val listFiltered = sharedFiltered.filter { matchesStatus(it, filter.status) }
        val sorted = sortByOrderDateDesc(listFiltered)
        val pageOrders = selectPage(sorted, page, size)
        val totalCount = countFiltered(sorted)

        return OrderListResponse(
            orders = pageOrders,
            summary = summary,
            pagination = buildPagination(page, size, totalCount)
        )
    }

    /** 입점사(자기 매장) 주문 목록을 조회한다. (DL §22) summary 없음 — admin과 달리 상태별 집계 카드가 화면에 없다. */
    fun getPartnerOrders(vendorId: String, filter: PartnerOrderFilter): OrderListResponse {
        val page = validatePage(filter.page)
        val size = validateSize(filter.size)
        validateDateRange(filter.from, filter.to)

        // vendorId: 이번 프로토타입은 mock 데이터셋이 이미 '해당 입점사 주문만'이라는 전제라
        // 실제 필터링에는 쓰지 않는다 — 향후 실 DB 연동 시 WHERE vendor_id = :vendorId로 자리 표시(placeholder)
        val allOrders = loadPartnerOrderDataset()
        val sharedFiltered = applySharedFilters(allOrders, filter.keyword, filter.from, filter.to)
        val listFiltered = sharedFiltered.filter { matchesStatus(it, filter.status) }
        val sorted = sortByOrderDateDesc(listFiltered)
        val pageOrders = selectPage(sorted, page, size)
        val totalCount = countFiltered(sorted)

        return OrderListResponse(
            orders = pageOrders,
            summary = null,
            pagination = buildPagination(page, size, totalCount)
        )
    }

    /** 로그인한 본인(me)의 주문 목록을 조회한다. (DL §11) */
    fun getMyOrders(): Map<String, Any> =
        mockLoader.load("order", "mobile__GET_my_orders.json")

    /** 장바구니 선택 상품으로 주문서를 생성한다. (DL §5) */
    fun createOrderSheet(): Map<String, Any> =
        mockLoader.load("order", "mobile__POST_my_orders_sheet.json")

    /** 어드민이 특정 주문의 상세를 조회한다. (DL §16) */
    fun getAdminOrderDetail(orderId: String): Map<String, Any> =
        mockLoader.load("order", "admin__GET_orders_{order_id}.json")

    /** 입점사가 자기 매장의 특정 주문 상세를 조회한다. (DL §23) */
    fun getPartnerOrderDetail(orderId: String): Map<String, Any> =
        mockLoader.load("order", "partner__GET_orders_{order_id}.json")

    /** 로그인한 본인(me)의 주문 상세를 조회한다. (DL §30) */
    fun getMyOrderDetail(orderId: String): Map<String, Any> =
        mockLoader.load("order", "mobile__GET_my_orders_{order_id}.json")

    // ── ① validation ──

    /** page는 1 이상이어야 한다. 위반 시 조용히 보정하지 않고 명시적으로 거부한다. */
    private fun validatePage(page: Int): Int {
        if (page < 1) {
            throw BadRequestException("INVALID_PAGE", "page는 1 이상이어야 합니다", "입력값: $page")
        }
        return page
    }

    /** size는 1~100 범위여야 한다 (전체 데이터셋을 한 번에 반환하는 과도한 요청을 방지). */
    private fun validateSize(size: Int): Int {
        if (size !in 1..100) {
            throw BadRequestException("INVALID_SIZE", "size는 1~100 사이여야 합니다", "입력값: $size")
        }
        return size
    }

    /** from/to가 둘 다 있으면 from <= to여야 한다. */
    private fun validateDateRange(from: String?, to: String?) {
        if (!from.isNullOrBlank() && !to.isNullOrBlank() && from > to) {
            throw BadRequestException("INVALID_DATE_RANGE", "from은 to보다 늦을 수 없습니다", "from=$from, to=$to")
        }
    }

    // ── ② mapper execute (list / count / summary) ──
    // 지금은 MockLoader가 전체 데이터셋을 로드하고 아래 메서드들이 사후 필터링한다.
    // DB 전환 시 loadXxxDataset()은 사라지고, applySharedFilters+matchesStatus+sortByOrderDateDesc+selectPage의 조건이
    // list/count 쿼리의 WHERE+ORDER BY+LIMIT/OFFSET으로, aggregateXxxSummary가 summary 쿼리의 WHERE+GROUP BY로 흡수된다.

    /** 어드민 목록용 전체 데이터셋을 로드한다. (list/count/summary 쿼리가 공통으로 조회할 테이블에 대응) */
    private fun loadAdminOrderDataset(): List<Map<String, Any>> =
        extractOrders(mockLoader.load("order", "admin__GET_orders.json"))

    /** 입점사 목록용 전체 데이터셋을 로드한다. */
    private fun loadPartnerOrderDataset(): List<Map<String, Any>> =
        extractOrders(mockLoader.load("order", "partner__GET_orders.json"))

    /** Mock 응답(JSON)에서 `data.orders[]` 배열을 꺼낸다. */
    @Suppress("UNCHECKED_CAST")
    private fun extractOrders(loaded: Map<String, Any>): List<Map<String, Any>> {
        val data = loaded["data"] as? Map<String, Any> ?: return emptyList()
        return (data["orders"] as? List<Map<String, Any>>) ?: emptyList()
    }

    /** list/count/summary 쿼리가 공통으로 쓰는 조건(keyword, dateRange)만 적용한다 — status는 호출부에서 별도 적용. */
    private fun applySharedFilters(orders: List<Map<String, Any>>, keyword: String?, from: String?, to: String?): List<Map<String, Any>> =
        orders.filter { matchesKeyword(it, keyword) && matchesDateRange(it, from, to) }

    /** 주문번호·상품명·고객명에 키워드가 포함되는지 확인한다. 키워드가 없으면 전체 통과. */
    private fun matchesKeyword(order: Map<String, Any>, keyword: String?): Boolean {
        if (keyword.isNullOrBlank()) return true
        val kw = keyword.lowercase()
        val platformOrderNo = (order["platformOrderNo"] as? String)?.lowercase() ?: ""
        val productName = (order["productName"] as? String)?.lowercase() ?: ""
        val customer = ((order["customer"] ?: order["customerName"]) as? String)?.lowercase() ?: ""
        return platformOrderNo.contains(kw) || productName.contains(kw) || customer.contains(kw)
    }

    /** 주문 상태가 필터값과 일치하는지 확인한다. status가 비어있거나 "ALL"이면 전체 통과. list/count 쿼리 전용 조건(summary에는 적용하지 않음). */
    private fun matchesStatus(order: Map<String, Any>, status: String?): Boolean {
        if (status.isNullOrBlank() || status == "ALL") return true
        return order["status"] == status
    }

    /** 주문일자가 from~to 범위(YYYY-MM-DD, 양쪽 포함) 안에 있는지 확인한다. from/to가 비어있으면 해당 경계는 무시한다. */
    private fun matchesDateRange(order: Map<String, Any>, from: String?, to: String?): Boolean {
        val orderDate = order["orderDate"] as? String ?: return true
        val datePart = if (orderDate.length >= 10) orderDate.substring(0, 10) else orderDate
        if (!from.isNullOrBlank() && datePart < from) return false
        if (!to.isNullOrBlank() && datePart > to) return false
        return true
    }

    /** list 쿼리의 ORDER BY에 대응 — 주문일자 기준 최신순(내림차순) 정렬. */
    private fun sortByOrderDateDesc(orders: List<Map<String, Any>>): List<Map<String, Any>> =
        orders.sortedByDescending { (it["orderDate"] as? String) ?: "" }

    /** list 쿼리의 LIMIT/OFFSET에 대응 — 정렬된 전체 목록에서 요청한 page/size 구간만 선택한다. */
    private fun selectPage(sortedOrders: List<Map<String, Any>>, page: Int, size: Int): List<Map<String, Any>> {
        val startIndex = (page - 1) * size
        return sortedOrders.drop(startIndex).take(size)
    }

    /** count 쿼리에 대응 — list와 동일 WHERE 조건(상태 필터 포함)의 전체 건수. 지금은 메모리의 리스트 크기로 대신한다. */
    private fun countFiltered(listFilteredOrders: List<Map<String, Any>>): Int = listFilteredOrders.size

    /** summary 쿼리(GROUP BY status)에 대응 — status 조건 없이 전체 상태 분포를 집계한다. */
    private fun aggregateAdminSummary(sharedFilteredOrders: List<Map<String, Any>>): Map<String, Any> {
        val counts = adminStatusSummaryKeys.values.associateWith { 0 }.toMutableMap()
        sharedFilteredOrders.forEach { order ->
            val status = order["status"] as? String ?: return@forEach
            val key = adminStatusSummaryKeys[status] ?: return@forEach
            counts[key] = (counts[key] ?: 0) + 1
        }
        return mapOf("all" to sharedFilteredOrders.size) + counts
    }

    // ── ③ dto convert ──

    /** 응답에 포함할 Pagination DTO를 만든다. */
    private fun buildPagination(page: Int, size: Int, totalCount: Int): Pagination {
        val totalPages = if (totalCount == 0) 1 else ceil(totalCount.toDouble() / size).toInt().coerceAtLeast(1)
        return Pagination(page = page, size = size, totalCount = totalCount, totalPages = totalPages)
    }
}
