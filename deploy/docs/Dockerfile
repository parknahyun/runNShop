# docsify 정적 사이트. 빌드 컨텍스트는 저장소 루트 (docker-compose.yml 참고)
FROM node:22-alpine AS sidebar
WORKDIR /w
COPY docs ./docs
COPY scripts/gen-docs-sidebar.js ./scripts/gen-docs-sidebar.js
RUN node scripts/gen-docs-sidebar.js docs

FROM nginx:1.27-alpine
COPY --from=sidebar /w/docs /usr/share/nginx/html
