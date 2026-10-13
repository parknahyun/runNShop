package com.runnshop.member.controller

import com.runnshop.common.MockLoader
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class CustomerMemberController(private val mockLoader: MockLoader) {

    @GetMapping("/api/mobile/v1/my/summary")
    fun getMySummary(): ResponseEntity<Any> {
        val data = mockLoader.load("member", "mobile__GET_my_summary.json")
        return ResponseEntity.ok(data)
    }
}
