package com.runnshop.promotion.controller

import com.runnshop.common.MockLoader
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RestController

@RestController
class CustomerExhibitionController(private val mockLoader: MockLoader) {

    @GetMapping("/api/v1/exhibitions")
    fun getExhibitions(): ResponseEntity<Any> {
        val data = mockLoader.load("v1", "promotion__GET_exhibitions.json")
        return ResponseEntity.ok(data)
    }

    @GetMapping("/api/v1/display/pages/exhibition/{exhibitionCode}")
    fun getExhibitionPage(@PathVariable exhibitionCode: String): ResponseEntity<Any> {
        val data = mockLoader.load("v1", "promotion__GET_display_pages_exhibition_{exhibition_code}.json")
        return ResponseEntity.ok(data)
    }
}
