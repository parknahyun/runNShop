package com.runnshop.catalog.controller

import com.runnshop.common.MockLoader
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RestController

@RestController
class CustomerProductController(private val mockLoader: MockLoader) {

    @GetMapping("/api/mobile/v1/products/{productId}")
    fun getProduct(@PathVariable productId: Long): ResponseEntity<Any> {
        val data = mockLoader.load("catalog", "mobile__GET_products_{product_id}.json")
        return ResponseEntity.ok(data)
    }
}
