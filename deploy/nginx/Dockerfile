FROM nginx:1.27-alpine
RUN apk add --no-cache apache2-utils
# /etc/nginx/templates/*.template 는 시작 시 환경변수가 치환되어 conf.d 로 렌더링된다
COPY default.conf.template /etc/nginx/templates/default.conf.template
# 시작 스크립트 (Windows CRLF 체크아웃 대비 줄바꿈 정리)
COPY 40-docs-auth.sh /docker-entrypoint.d/40-docs-auth.sh
RUN sed -i 's/\r$//' /docker-entrypoint.d/40-docs-auth.sh && chmod +x /docker-entrypoint.d/40-docs-auth.sh
