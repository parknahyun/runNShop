package com.runnshop.order.controller

import com.runnshop.common.MockLoader
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/admin/v1/orders")
class AdminOrderController(private val mockLoader: MockLoader) {

    @GetMapping
    fun searchOrders(
        @RequestParam(required = false) keyword: String?,
        @RequestParam(required = false, defaultValue = "ALL") status: String?,
        @RequestParam(required = false) from: String?,
        @RequestParam(required = false) to: String?,
        @RequestParam(required = false, defaultValue = "1") page: Int?,
        @RequestParam(required = false, defaultValue = "10") size: Int?
    ): ResponseEntity<Any> {
        val data = mockLoader.load("admin", "order__GET_admin_v1_orders.json")
        return ResponseEntity.ok(data)
    }

    @GetMapping("/{orderId}")
    fun getOrderDetail(@PathVariable orderId: String): ResponseEntity<Any> {
        val data = mockLoader.load("admin", "order__GET_admin_v1_orders_{order_id}.json")
        return ResponseEntity.ok(data)
    }
}
