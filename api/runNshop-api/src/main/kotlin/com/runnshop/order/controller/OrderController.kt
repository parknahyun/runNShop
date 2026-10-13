package com.runnshop.order.controller

import com.runnshop.order.service.AdminOrderFilter
import com.runnshop.order.service.OrderService
import com.runnshop.order.service.PartnerOrderFilter
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

/**
 * order/ 서브도메인 통합 Controller.
 * 앱(FE)별로 Controller를 나누지 않고, 메서드 + URL 매핑으로만 구분한다.
 * (DM-시퀀스/readme.md §1 v3, DP-클래스설계/order.md §1 참조)
 * Controller는 요청/응답만 처리하고 가공 로직은 전부 OrderService가 담당한다 — MockLoader는 직접 주입받지 않는다.
 */
@RestController
class OrderController(private val orderService: OrderService) {

    // ── 회원(mobile) ──

    /** 장바구니 선택 상품으로 주문서를 생성한다. 배송지·쿠폰·포인트·결제수단 정보를 반환한다. (DL §5) */
    @PostMapping("/api/mobile/v1/my/orders/sheet")
    fun createOrderSheet(): ResponseEntity<Any> {
        val data = orderService.createOrderSheet()
        return ResponseEntity.ok(data)
    }

    /** 로그인한 본인(me)의 주문 목록을 조회한다. (DL §11) */
    @GetMapping("/api/mobile/v1/my/orders")
    fun getMyOrders(): ResponseEntity<Any> {
        val data = orderService.getMyOrders()
        return ResponseEntity.ok(data)
    }

    /** 로그인한 본인(me)의 주문 상세를 조회한다. 입점사별 상품·결제정보·배송정보·주문이력을 포함한다. (DL §30) */
    @GetMapping("/api/mobile/v1/my/orders/{orderId}")
    fun getMyOrderDetail(@PathVariable orderId: String): ResponseEntity<Any> {
        val data = orderService.getMyOrderDetail(orderId)
        return ResponseEntity.ok(data)
    }

    // ── 관리자(admin) ──

    /** 어드민(CS)이 전체 회원 주문을 키워드·상태·기간으로 검색한다. (DL §15) */
    @GetMapping("/api/admin/v1/orders")
    fun getAdminOrders(
        @RequestParam(required = false) keyword: String?,
        @RequestParam(required = false, defaultValue = "ALL") status: String?,
        @RequestParam(required = false) from: String?,
        @RequestParam(required = false) to: String?,
        @RequestParam(required = false, defaultValue = "1") page: Int?,
        @RequestParam(required = false, defaultValue = "10") size: Int?
    ): ResponseEntity<Any> {
        val data = orderService.getAdminOrders(
            AdminOrderFilter(keyword = keyword, status = status, from = from, to = to, page = page ?: 1, size = size ?: 10)
        )
        return ResponseEntity.ok(mapOf("code" to "SUCCESS", "data" to data))
    }

    /** 어드민(CS)이 특정 주문의 상세(상품/결제/배송/클레임/문의/변경이력)를 조회한다. (DL §16) */
    @GetMapping("/api/admin/v1/orders/{orderId}")
    fun getAdminOrderDetail(@PathVariable orderId: String): ResponseEntity<Any> {
        val data = orderService.getAdminOrderDetail(orderId)
        return ResponseEntity.ok(data)
    }

    // ── 파트너(partner) ──

    /** 입점사가 자기 매장 주문을 상태·기간·키워드로 검색한다. (DL §22) */
    @GetMapping("/api/partner/v1/orders")
    fun getPartnerOrders(
        @RequestParam(required = false, defaultValue = "ALL") status: String?,
        @RequestParam(required = false) from: String?,
        @RequestParam(required = false) to: String?,
        @RequestParam(required = false) keyword: String?,
        @RequestParam(required = false, defaultValue = "1") page: Int?,
        @RequestParam(required = false, defaultValue = "10") size: Int?
    ): ResponseEntity<Any> {
        // TODO: 실 인증 연동 전 placeholder — 추후 X-Vendor-Id 헤더 등으로 교체
        val vendorId = "self"
        val data = orderService.getPartnerOrders(
            vendorId,
            PartnerOrderFilter(keyword = keyword, status = status, from = from, to = to, page = page ?: 1, size = size ?: 10)
        )
        return ResponseEntity.ok(mapOf("code" to "SUCCESS", "data" to data))
    }

    /** 입점사가 자기 매장의 특정 주문 상세(상품/배송/클레임/변경이력)를 조회한다. (DL §23) */
    @GetMapping("/api/partner/v1/orders/{orderId}")
    fun getPartnerOrderDetail(@PathVariable orderId: String): ResponseEntity<Any> {
        val data = orderService.getPartnerOrderDetail(orderId)
        return ResponseEntity.ok(data)
    }
}
