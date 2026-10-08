package com.runnshop.order.controller

import com.runnshop.order.service.OrderService
import com.runnshop.order.service.PartnerOrderFilter
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/partner/v1/orders")
class PartnerOrderController(private val orderService: OrderService) {

    @GetMapping
    fun searchOrders(
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

    @GetMapping("/{orderId}")
    fun getOrderDetail(@PathVariable orderId: String): ResponseEntity<Any> {
        val data = orderService.getPartnerOrderDetail(orderId)
        return ResponseEntity.ok(data)
    }
}
