package com.runnshop.order.controller

import com.runnshop.common.MockLoader
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RestController

/**
 * claim/ 서브도메인 통합 Controller.
 * 이번 범위는 고객(mobile) 클레임 목록/상세 조회만 이동한 것이고,
 * Claim 서브도메인의 Service 레이어 설계는 범위 밖이므로 MockLoader를 그대로 유지한다.
 * (DM-시퀀스/readme.md §1 v3, DP-클래스설계/order.md §1 참조)
 */
@RestController
class ClaimController(private val mockLoader: MockLoader) {

    @GetMapping("/api/mobile/v1/my/claims")
    fun getMyClaims(): ResponseEntity<Any> {
        val data = mockLoader.load("order", "mobile__GET_my_claims.json")
        return ResponseEntity.ok(data)
    }

    @GetMapping("/api/mobile/v1/my/claims/{claimId}")
    fun getMyClaimDetail(@PathVariable claimId: String): ResponseEntity<Any> {
        val data = mockLoader.load("order", "mobile__GET_my_claims_{claim_id}.json")
        return ResponseEntity.ok(data)
    }
}
