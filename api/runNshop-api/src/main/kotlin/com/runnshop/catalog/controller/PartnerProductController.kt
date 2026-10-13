package com.runnshop.catalog.controller

import com.runnshop.common.MockLoader
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/partner/v1/products")
class PartnerProductController(private val mockLoader: MockLoader) {

    @GetMapping
    fun getProducts(): ResponseEntity<Any> {
        val data = mockLoader.load("catalog", "partner__GET_products.json")
        return ResponseEntity.ok(data)
    }
}
