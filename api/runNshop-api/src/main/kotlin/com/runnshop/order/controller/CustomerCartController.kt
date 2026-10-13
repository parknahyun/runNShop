package com.runnshop.order.controller

import com.runnshop.common.MockLoader
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class CustomerCartController(private val mockLoader: MockLoader) {

    @GetMapping("/api/mobile/v1/my/cart")
    fun getCart(): ResponseEntity<Any> {
        val data = mockLoader.load("order", "mobile__GET_my_cart.json")
        return ResponseEntity.ok(data)
    }
}
