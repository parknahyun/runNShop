package com.runnshop.order.controller

import com.runnshop.common.MockLoader
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class CustomerOrderController(private val mockLoader: MockLoader) {

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
}
