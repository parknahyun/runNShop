package com.runnshop.member.controller

import com.runnshop.common.MockLoader
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class CustomerMemberController(private val mockLoader: MockLoader) {

    @GetMapping("/api/v1/members/me/summary")
    fun getMySummary(): ResponseEntity<Any> {
        val data = mockLoader.load("v1", "member__GET_members_me_summary.json")
        return ResponseEntity.ok(data)
    }
}
