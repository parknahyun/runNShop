# TSK-DPL-SEC-001-BE — 섹션 관리 API 구현 (v2, 원천 현행화 반영)

> v1(원본: `docs/x. 하네스/샘플/09-DPL...` 샘플 1) 검증에서 `source_domain: DOM-CATALOG`,
> `source_tech: TC-001`이 원천 문서에 없는 인용이었음을 확인. `DOM-CATALOG`는
> `docs_ai/03-도메인/Catalog-Display.md`로 현행화했다. `TC-001` 같은 TC-ID 체계는 검토 끝에
> **도입하지 않기로 결정** — 대신 실제 원본(요구사항/정책서/ERD)을 Task Spec에서 직접 인용한다.

```yaml
task_id: TSK-DPL-SEC-001-BE
task_name: 섹션 관리 API 구현 (마스터 CRUD + 필드 스키마)
dev_type: BE
domain: Display (Catalog 하위)
app: runNshop-api
decision_type: A

source_screen: ADM-020-010
source_domain: DOM-CATALOG          # ✅ docs_ai/03-도메인/Catalog-Display.md에서 정의됨 (v1 시점엔 원본에 없었음)
source_entity: cat_display_section_type, cat_display_section_field   # ⑥ 2026-07-06 ERD 신규 반영, 확인됨
source_tech:                        # [v2] TC-ID 체계 대신 원본 직접 인용
  - "물리적 DELETE 금지: 요구사항 FR-COM-005 / 정책서 §19.1 / ERD 설계원칙(line 35)"
  - "도메인 간 직접 테이블 접근 금지: 도메인정의서 §1 설계원칙 '데이터 소유권' (line 37)"
source_policy: §3.13 섹션 관리 정책 (`docs_ai/02-정책서/3.13-섹션종류관리정책.md`, 신설
  — v1 시점엔 "해당 정책 없음"이 맞았으나 화면 검증 후 정식 정책 섹션으로 승격됨)

reference_impl: 없음 — 전시 도메인 체인의 시작점, 이후 템플릿·페이지 BE의 참고 대상
depends_on: []
cross_module_deps:                   # [v1.1 신규 필드]
  - HC-DPL-SEC-004(사용 중인 섹션 DEPRECATED 시도 시 409)를 판단하려면 Template 도메인의
    "이 섹션을 참조하는 템플릿 영역이 있는가"를 조회해야 한다 — 이는 TSK-DPL-TPL-001-BE가
    담당하는 cat_display_area 테이블 조회이므로, 이 Task보다 나중에 구현되는 Template BE와
    간접적으로 결합돼 있다 (도메인 간 직접 접근 금지 원칙에 따라 직접 SQL 조회가 아니라
    Template 도메인이 제공하는 내부 API/쿼리 메서드를 통해 확인해야 함)
assignee: AI(Kiro)
status: TODO
```

### AI 코딩 지시 (BE)

```
1. DTO:
   CreateSectionTypeRequest(sectionCode, sectionName, type, description, previewColor,
     sortOrder, itemCount, layoutType)
   UpdateSectionTypeRequest(sectionName, description, previewColor, sortOrder, itemCount,
     layoutType, status)              # sectionCode는 수정 불가
   SaveFieldsRequest(fields: FieldDefinition[])
   FieldDefinition(fieldKey, label, fieldType, required, defaultValue, placeholder)

2. Repository: SectionTypeRepository
   - INSERT/UPDATE cat_display_section_type (ERD:1105 확인됨)
   - INSERT/UPDATE cat_display_section_field (ERD:1135 확인됨, section_type_id FK)
   invariants: sectionCode UNIQUE (ERD:1114), 섹션 내 fieldKey UNIQUE (ERD:1156, uk_section_field)

3. Service: SectionTypeService
   HARD:
     - HC-DPL-SEC-001: sectionCode는 등록 후 수정 불가
     - HC-DPL-SEC-002: fieldKey는 필드 등록 후 수정 불가 (ERD:1141-1142 "immutable" 주석과 일치)
     - HC-DPL-SEC-003: 물리적 DELETE 금지(요구사항 FR-COM-005/정책서 §19.1) — 삭제 요청은
       status=DEPRECATED 전환. 표준 컬럼(is_deleted/deleted_at/deleted_by)도 그대로 유지하며
       status 전환을 **병행**한다(ERD:1124-1125 주석, 상품 도메인의 DISCONTINUED 병행 패턴과
       동일 — 정책서 §19.3, `docs_ai/02-정책서/19.3-소프트삭제-Display추가.md` 참조)
     - HC-DPL-SEC-004: 템플릿에서 사용 중인 섹션을 DEPRECATED 전환 시 409 응답 — cross_module_deps
       참조. force=true 파라미터로만 강제 허용
   준수: 도메인 간 직접 테이블 접근 금지(도메인정의서 §1) — cat_display_area 조회는 Template
   도메인의 내부 API를 통해서만 수행, cat_display_area 테이블에 직접 SQL 조회 금지

4. Controller: SectionTypeController
   GET    /api/admin/v1/display/section-types                     (목록, 필터: keyword/status)
   POST   /api/admin/v1/display/section-types                     (등록)
   PUT    /api/admin/v1/display/section-types/{sectionCode}       (기본정보 수정)
   PUT    /api/admin/v1/display/section-types/{sectionCode}/fields (필드 일괄 저장)
   DELETE /api/admin/v1/display/section-types/{sectionCode}       (DEPRECATED 전환)
   어드민 로그인 필수, role=[ADMIN, MD]

5. 예외 처리:
   - {code: SECTION_CODE_DUPLICATE, http: 409, condition: "sectionCode 중복", message_key: "error.display.section_code_duplicate"}
   - {code: FIELD_KEY_DUPLICATE, http: 422, condition: "동일 섹션 내 fieldKey 중복", message_key: "error.display.field_key_duplicate"}
   - {code: SECTION_TYPE_IN_USE, http: 409, condition: "사용 중인 섹션 DEPRECATED 시도, force=false", message_key: "error.display.section_type_in_use"}

6. 이벤트: 없음

생성 대상 파일:
  - SectionTypeController.kt / SectionTypeService.kt / SectionTypeRepository.kt
  - CreateSectionTypeRequest.kt / UpdateSectionTypeRequest.kt / SaveFieldsRequest.kt

금지 사항:
  - sectionCode / fieldKey를 UPDATE 쿼리 대상 컬럼에 포함
  - DELETE 물리 삭제 쿼리 작성 (요구사항 FR-COM-005/정책서 §19.1)
  - cat_display_area/cat_display_template에 직접 SQL 조회 (도메인정의서 §1 — Template 도메인 API 경유)
```

### 작업결과물 확인 (BE)

```
자동 확인:
  □ Gradle build 성공 / ktlint 오류 없음
  □ 단위 테스트 통과 (등록 / sectionCode 중복 / fieldKey 중복 / 사용중 DEPRECATED 시도 4케이스 이상)
  □ 커버리지 ≥ 80%

크로스 확인:
  □ sectionCode·fieldKey immutable 여부 코드 대조
  □ 물리 삭제 쿼리 없음 확인 (FR-COM-005/정책서 §19.1)
  □ 필드 일괄 저장이 "기존 필드 전체 교체"로 동작하는지 확인
  □ [v2] source_domain(DOM-CATALOG)·source_policy(§3.13) 인용이 docs_ai 문서와 실제로 연결되는지
    확인 — v1은 이 확인 자체가 불가능했음(원천에 해당 ID가 없었음)
  □ [v2] cat_display_area 조회가 Template 도메인 API 경유로 구현됐는지 확인 (직접 SQL 아님)

✅ 설계 확정 완료 (2026-07-06): cat_display_section_type / cat_display_section_field 테이블을
ERD에 신규 반영함 (decision_log 2026-07-06 참조). 착수 가능.
✅ [v2] source_domain·source_policy 인용도 현행화 완료 (docs_ai/03-도메인, docs_ai/02-정책서).
착수 가능. source_tech는 TC-ID 체계를 도입하지 않기로 결정하여 원본 직접 인용 방식으로 확정.
```
