#!/bin/sh
# /docs, /plantuml 용 basic auth 계정 생성 (시작 시 환경변수로부터).
# 비밀번호가 없으면 종료 → 게이트웨이가 뜨지 않아 인증 없이 열리는 일이 없다 (fail-closed).
set -e
: "${DOCS_USER:=docs}"
if [ -z "${DOCS_PASSWORD:-}" ]; then
  echo "40-docs-auth.sh: DOCS_PASSWORD 가 설정되지 않았습니다 (.env 에 설정)" >&2
  exit 1
fi
htpasswd -bBc /etc/nginx/docs.htpasswd "$DOCS_USER" "$DOCS_PASSWORD"
echo "40-docs-auth.sh: docs 계정 '$DOCS_USER' 생성"
