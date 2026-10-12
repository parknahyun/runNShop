package com.runnshop.order.service

import com.runnshop.common.MockLoader
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
 * 프로토타입 단계에서는 MockLoader가 로드한 "전체 데이터셋" JSON 위에서
 * 필터/정렬/페이징/summary 집계를 수행한다. (DP-클래스설계/order.md 네이밍 준수)
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

    fun getAdminOrders(filter: AdminOrderFilter): Map<String, Any> {
        val loaded = mockLoader.load("order", "admin__GET_orders.json")
        val allOrders = extractOrders(loaded)

        val keywordDateFiltered = allOrders.filter {
            matchesKeyword(it, filter.keyword) && matchesDateRange(it, filter.from, filter.to)
        }
        val summary = buildAdminSummary(keywordDateFiltered)

        val statusFiltered = keywordDateFiltered.filter { matchesStatus(it, filter.status) }
        val sorted = sortByOrderDateDesc(statusFiltered)

        val page = filter.page.coerceAtLeast(1)
        val size = filter.size.coerceAtLeast(1)
        val pageOrders = paginate(sorted, page, size)
        val pagination = buildPagination(page, size, sorted.size)

        return mapOf(
            "code" to "SUCCESS",
            "data" to mapOf(
                "orders" to pageOrders,
                "summary" to summary,
                "pagination" to pagination
            )
        )
    }

    fun getPartnerOrders(vendorId: String, filter: PartnerOrderFilter): Map<String, Any> {
        // vendorId: 이번 프로토타입은 mock 데이터셋이 이미 '해당 입점사 주문만'이라는 전제라
        // 실제 필터링에는 쓰지 않는다 — 향후 실 DB 연동 시 자리 표시(placeholder)
        val loaded = mockLoader.load("order", "partner__GET_orders.json")
        val allOrders = extractOrders(loaded)

        val filtered = allOrders.filter {
            matchesKeyword(it, filter.keyword) &&
                matchesDateRange(it, filter.from, filter.to) &&
                matchesStatus(it, filter.status)
        }
        val sorted = sortByOrderDateDesc(filtered)

        val page = filter.page.coerceAtLeast(1)
        val size = filter.size.coerceAtLeast(1)
        val pageOrders = paginate(sorted, page, size)
        val pagination = buildPagination(page, size, sorted.size)

        return mapOf(
            "code" to "SUCCESS",
            "data" to mapOf(
                "orders" to pageOrders,
                "pagination" to pagination
            )
        )
    }

    fun getMyOrders(memberId: String, page: Int, size: Int, status: String?): Map<String, Any> =
        mockLoader.load("order", "mobile__GET_my_orders.json")

    fun getAdminOrderDetail(orderId: String): Map<String, Any> =
        mockLoader.load("order", "admin__GET_orders_{order_id}.json")

    fun getPartnerOrderDetail(orderId: String): Map<String, Any> =
        mockLoader.load("order", "partner__GET_orders_{order_id}.json")

    fun getMyOrderDetail(orderId: String): Map<String, Any> =
        mockLoader.load("order", "mobile__GET_my_orders_{order_id}.json")

    // ── 내부 가공 로직 ──

    @Suppress("UNCHECKED_CAST")
    private fun extractOrders(loaded: Map<String, Any>): List<Map<String, Any>> {
        val data = loaded["data"] as? Map<String, Any> ?: return emptyList()
        return (data["orders"] as? List<Map<String, Any>>) ?: emptyList()
    }

    private fun matchesKeyword(order: Map<String, Any>, keyword: String?): Boolean {
        if (keyword.isNullOrBlank()) return true
        val kw = keyword.lowercase()
        val platformOrderNo = (order["platformOrderNo"] as? String)?.lowercase() ?: ""
        val productName = (order["productName"] as? String)?.lowercase() ?: ""
        val customer = ((order["customer"] ?: order["customerName"]) as? String)?.lowercase() ?: ""
        return platformOrderNo.contains(kw) || productName.contains(kw) || customer.contains(kw)
    }

    private fun matchesStatus(order: Map<String, Any>, status: String?): Boolean {
        if (status.isNullOrBlank() || status == "ALL") return true
        return order["status"] == status
    }

    private fun matchesDateRange(order: Map<String, Any>, from: String?, to: String?): Boolean {
        val orderDate = order["orderDate"] as? String ?: return true
        val datePart = if (orderDate.length >= 10) orderDate.substring(0, 10) else orderDate
        if (!from.isNullOrBlank() && datePart < from) return false
        if (!to.isNullOrBlank() && datePart > to) return false
        return true
    }

    private fun sortByOrderDateDesc(orders: List<Map<String, Any>>): List<Map<String, Any>> =
        orders.sortedByDescending { (it["orderDate"] as? String) ?: "" }

    private fun paginate(orders: List<Map<String, Any>>, page: Int, size: Int): List<Map<String, Any>> {
        val startIndex = (page - 1) * size
        return orders.drop(startIndex).take(size)
    }

    private fun buildPagination(page: Int, size: Int, totalCount: Int): Map<String, Any> {
        val totalPages = if (totalCount == 0) 1 else ceil(totalCount.toDouble() / size).toInt().coerceAtLeast(1)
        return mapOf("page" to page, "size" to size, "totalCount" to totalCount, "totalPages" to totalPages)
    }

    private fun buildAdminSummary(orders: List<Map<String, Any>>): Map<String, Any> {
        val counts = adminStatusSummaryKeys.values.associateWith { 0 }.toMutableMap()
        orders.forEach { order ->
            val status = order["status"] as? String ?: return@forEach
            val key = adminStatusSummaryKeys[status] ?: return@forEach
            counts[key] = (counts[key] ?: 0) + 1
        }
        return mapOf("all" to orders.size) + counts
    }
}
