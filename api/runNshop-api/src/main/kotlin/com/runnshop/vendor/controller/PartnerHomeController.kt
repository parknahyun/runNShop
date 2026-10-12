package com.runnshop.vendor.controller

import com.runnshop.common.MockLoader
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/partner/v1/home")
class PartnerHomeController(private val mockLoader: MockLoader) {

    @GetMapping("/summary")
    fun getSummary(): ResponseEntity<Any> {
        val data = mockLoader.load("vendor", "partner__GET_home_summary.json")
        return ResponseEntity.ok(data)
    }

    @GetMapping("/pending")
    fun getPending(): ResponseEntity<Any> {
        val data = mockLoader.load("vendor", "partner__GET_home_pending.json")
        return ResponseEntity.ok(data)
    }

    @GetMapping("/trend")
    fun getTrend(): ResponseEntity<Any> {
        val data = mockLoader.load("order", "partner__GET_home_trend.json")
        return ResponseEntity.ok(data)
    }

    @GetMapping("/products/summary")
    fun getProductsSummary(): ResponseEntity<Any> {
        val data = mockLoader.load("catalog", "partner__GET_home_products_summary.json")
        return ResponseEntity.ok(data)
    }

    @GetMapping("/notices")
    fun getNotices(): ResponseEntity<Any> {
        val data = mockLoader.load("vendor", "partner__GET_home_notices.json")
        return ResponseEntity.ok(data)
    }
}
