package com.runnshop.common

import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.core.io.ClassPathResource
import org.springframework.stereotype.Component

@Component
class MockLoader(private val objectMapper: ObjectMapper) {

    /**
     * Mock JSON 파일을 로드하여 Map으로 반환한다.
     *
     * @param channel Mock 파일이 속한 도메인 폴더명 (order, catalog, member, ...)
     * @param filename 채널 접두사(admin__/partner__/mobile__)가 포함된 파일명
     *   (예: mobile__GET_products_{product_id}.json)
     */
    fun load(channel: String, filename: String): Map<String, Any> {
        val resource = ClassPathResource("mock/$channel/$filename")
        return if (resource.exists()) {
            objectMapper.readValue(resource.inputStream, Map::class.java) as Map<String, Any>
        } else {
            mapOf(
                "code" to "NOT_FOUND",
                "message" to "Mock 파일을 찾을 수 없습니다: mock/$channel/$filename"
            )
        }
    }
}
