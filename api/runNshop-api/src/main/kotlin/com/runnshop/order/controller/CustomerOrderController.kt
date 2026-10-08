package com.runnshop.order.controller

import com.runnshop.common.MockLoader
import com.runnshop.order.service.OrderService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class CustomerOrderController(
    private val mockLoader: MockLoader,
    private val orderService: OrderService
) {

    @PostMapping("/api/v1/orders/sheet")
    fun createOrderSheet(): ResponseEntity<Any> {
        val data = mockLoader.load("v1", "order__POST_orders_sheet.json")
        return ResponseEntity.ok(data)
    }

    @GetMapping("/api/v1/orders/sheet")
    fun getOrderSheet(): ResponseEntity<Any> {
        val data = mockLoader.load("v1", "order__POST_orders_sheet.json")
        return ResponseEntity.ok(data)
    }

    @GetMapping("/api/v1/members/me/orders")
    fun getMyOrders(): ResponseEntity<Any> {
        val data = mockLoader.load("v1", "order__GET_members_me_orders.json")
        return ResponseEntity.ok(data)
    }

    @GetMapping("/api/v1/members/me/orders/{orderId}")
    fun getMyOrderDetail(@PathVariable orderId: String): ResponseEntity<Any> {
        val data = orderService.getMyOrderDetail(orderId)
        return ResponseEntity.ok(data)
    }

    @GetMapping("/api/v1/members/me/claims")
    fun getMyClaims(): ResponseEntity<Any> {
        val data = mockLoader.load("v1", "order__GET_members_me_claims.json")
        return ResponseEntity.ok(data)
    }

    @GetMapping("/api/v1/members/me/claims/{claimId}")
    fun getMyClaimDetail(@PathVariable claimId: String): ResponseEntity<Any> {
        val data = mockLoader.load("v1", "order__GET_members_me_claims_{claim_id}.json")
        return ResponseEntity.ok(data)
    }
}
