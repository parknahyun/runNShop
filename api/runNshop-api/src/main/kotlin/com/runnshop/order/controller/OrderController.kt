package com.runnshop.order.controller

import com.runnshop.common.MockLoader
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
 */
@RestController
class OrderController(
    private val mockLoader: MockLoader,
    private val orderService: OrderService
) {

    // ── 주문서 (고객) ──

    @PostMapping("/api/mobile/v1/my/orders/sheet")
    fun createOrderSheet(): ResponseEntity<Any> {
        val data = mockLoader.load("order", "mobile__POST_my_orders_sheet.json")
        return ResponseEntity.ok(data)
    }

    @GetMapping("/api/mobile/v1/my/orders/sheet")
    fun getOrderSheet(): ResponseEntity<Any> {
        val data = mockLoader.load("order", "mobile__POST_my_orders_sheet.json")
        return ResponseEntity.ok(data)
    }

    // ── 고객 주문 목록/상세 ──

    @GetMapping("/api/mobile/v1/my/orders")
    fun getMyOrders(): ResponseEntity<Any> {
        val data = mockLoader.load("order", "mobile__GET_my_orders.json")
        return ResponseEntity.ok(data)
    }

    @GetMapping("/api/mobile/v1/my/orders/{orderId}")
    fun getMyOrderDetail(@PathVariable orderId: String): ResponseEntity<Any> {
        val data = orderService.getMyOrderDetail(orderId)
        return ResponseEntity.ok(data)
    }

    // ── 어드민 주문 목록/상세 ──

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
        return ResponseEntity.ok(data)
    }

    @GetMapping("/api/admin/v1/orders/{orderId}")
    fun getAdminOrderDetail(@PathVariable orderId: String): ResponseEntity<Any> {
        val data = orderService.getAdminOrderDetail(orderId)
        return ResponseEntity.ok(data)
    }

    // ── 입점사 주문 목록/상세 ──

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
        return ResponseEntity.ok(data)
    }

    @GetMapping("/api/partner/v1/orders/{orderId}")
    fun getPartnerOrderDetail(@PathVariable orderId: String): ResponseEntity<Any> {
        val data = orderService.getPartnerOrderDetail(orderId)
        return ResponseEntity.ok(data)
    }
}
