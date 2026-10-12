package com.runnshop.order.dto

/** 주문 목록 응답 공통 DTO. admin/partner/mobile 목록 API가 공유한다. (DP-클래스설계/order.md §1 참조) */
data class OrderListResponse(
    val orders: List<Map<String, Any>>,
    val summary: Map<String, Any>? = null,
    val pagination: Pagination
)

/** 페이지네이션 메타데이터. */
data class Pagination(
    val page: Int,
    val size: Int,
    val totalCount: Int,
    val totalPages: Int
)
