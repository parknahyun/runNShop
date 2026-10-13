package com.runnshop.common.exception

import org.springframework.http.HttpStatus

/**
 * DL-인터페이스명세의 "Error Responses" 표(HTTP/code/message)에 대응하는 공용 업무 예외.
 * 전역 핸들러(GlobalExceptionHandler)가 이 예외를 `{code, message, detail}` 표준 응답으로 변환한다.
 */
open class ApiException(
    val httpStatus: HttpStatus,
    val code: String,
    message: String,
    val detail: String? = null
) : RuntimeException(message)

/** 400 — 요청 파라미터/Body 형식이 잘못됨. 예: ADDRESS_REQUIRED, TRACKING_NO_REQUIRED, REASON_REQUIRED. */
class BadRequestException(code: String, message: String, detail: String? = null) :
    ApiException(HttpStatus.BAD_REQUEST, code, message, detail)

/** 401 — 인증 필요(Bearer 토큰 없음/만료). */
class UnauthorizedException(code: String = "UNAUTHORIZED", message: String = "인증이 필요합니다", detail: String? = null) :
    ApiException(HttpStatus.UNAUTHORIZED, code, message, detail)

/** 403 — 인증은 됐으나 권한 없음(타인 리소스 접근 등). */
class ForbiddenException(code: String = "FORBIDDEN", message: String = "권한이 없습니다", detail: String? = null) :
    ApiException(HttpStatus.FORBIDDEN, code, message, detail)

/** 404 — 리소스 없음. 예: CLAIM_NOT_FOUND. */
class NotFoundException(code: String, message: String, detail: String? = null) :
    ApiException(HttpStatus.NOT_FOUND, code, message, detail)

/** 409 — 현재 상태에서 허용되지 않는 요청(상태머신 위반). 예: CANCEL_NOT_ALLOWED, SHIP_NOT_ALLOWED, STOCK_NOT_AVAILABLE. */
class ConflictException(code: String, message: String, detail: String? = null) :
    ApiException(HttpStatus.CONFLICT, code, message, detail)

/** 422 — 요청 형식은 올바르나 처리 불가(기한 초과, 만료 등). 예: CLAIM_PERIOD_EXPIRED, COUPON_EXPIRED, PAYMENT_EXPIRED. */
class UnprocessableException(code: String, message: String, detail: String? = null) :
    ApiException(HttpStatus.UNPROCESSABLE_ENTITY, code, message, detail)
