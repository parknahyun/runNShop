package com.runnshop.config.controller

import com.runnshop.common.MockLoader
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/admin/v1/home")
class AdminHomeController(private val mockLoader: MockLoader) {

    @GetMapping("/summary")
    fun getSummary(): ResponseEntity<Any> {
        val data = mockLoader.load("admin", "config__GET_home_summary.json")
        return ResponseEntity.ok(data)
    }

    @GetMapping("/pending")
    fun getPending(): ResponseEntity<Any> {
        val data = mockLoader.load("admin", "config__GET_home_pending.json")
        return ResponseEntity.ok(data)
    }

    @GetMapping("/trend")
    fun getTrend(): ResponseEntity<Any> {
        val data = mockLoader.load("admin", "order__GET_home_trend.json")
        return ResponseEntity.ok(data)
    }

    @GetMapping("/alerts")
    fun getAlerts(): ResponseEntity<Any> {
        val data = mockLoader.load("admin", "config__GET_home_alerts.json")
        return ResponseEntity.ok(data)
    }
}
