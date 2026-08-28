package com.runnshop.common

import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.core.io.ClassPathResource
import org.springframework.stereotype.Component

@Component
class MockLoader(private val objectMapper: ObjectMapper) {

    /**
     * Mock JSON 파일을 로드하여 Map으로 반환한다.
     *
     * @param channel 앱 채널 (v1, admin, partner)
     * @param filename 파일명 (예: catalog__GET_products_{product_id}.json)
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
