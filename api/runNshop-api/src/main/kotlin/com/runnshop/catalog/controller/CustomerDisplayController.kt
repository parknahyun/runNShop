package com.runnshop.catalog.controller

import com.runnshop.common.MockLoader
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class CustomerDisplayController(private val mockLoader: MockLoader) {

    @GetMapping("/api/mobile/v1/display/pages/home")
    fun getHomePage(): ResponseEntity<Any> {
        val data = mockLoader.load("catalog", "mobile__GET_display_pages_home.json")
        return ResponseEntity.ok(data)
    }
}
