package com.runnshop.common.exception

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice

/**
 * 전역 예외 처리기. 모든 Controller(전 도메인 공용)에서 던진 예외를
 * `{code, message, detail}` 표준 응답(KIRO_START.md "에러 처리 표준")으로 변환한다.
 */
@RestControllerAdvice
class GlobalExceptionHandler {

    /** DL-인터페이스명세에 정의된 업무 예외(ApiException과 그 하위 타입)를 지정된 HTTP Status + 표준 응답으로 변환한다. */
    @ExceptionHandler(ApiException::class)
    fun handleApiException(e: ApiException): ResponseEntity<Map<String, Any?>> =
        ResponseEntity.status(e.httpStatus).body(
            mapOf("code" to e.code, "message" to e.message, "detail" to e.detail)
        )

    /** Service의 require()/파라미터 검증이 던진 형식/범위 오류를 400으로 변환한다. */
    @ExceptionHandler(IllegalArgumentException::class)
    fun handleIllegalArgument(e: IllegalArgumentException): ResponseEntity<Map<String, Any?>> =
        ResponseEntity.badRequest().body(
            mapOf("code" to "BAD_REQUEST", "message" to e.message, "detail" to null)
        )

    /** 그 외 예상치 못한 예외는 500 + 공용 코드로 감싸 스택트레이스를 클라이언트에 노출하지 않는다. */
    @ExceptionHandler(Exception::class)
    fun handleUnexpected(e: Exception): ResponseEntity<Map<String, Any?>> =
        ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
            mapOf("code" to "INTERNAL_ERROR", "message" to "서버 오류가 발생했습니다", "detail" to e.message)
        )
}
