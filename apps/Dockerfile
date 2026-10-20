# syntax=docker/dockerfile:1
# 프론트 3종 공용. 사용: docker build -f apps/Dockerfile --build-arg APP=runNshop-admin --build-arg PORT=3001 --build-arg BASE_PATH=/admin apps
FROM node:22-alpine
ARG APP
ARG PORT
ARG BASE_PATH=""
# NEXT_PUBLIC_* 는 빌드 시점에 번들에 박힌다. API는 같은 origin(/api)으로 호출.
ENV NEXT_PUBLIC_API_BASE="" \
    NEXT_PUBLIC_BASE_PATH=${BASE_PATH} \
    NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV=production \
    PORT=${PORT}
WORKDIR /app
COPY ${APP}/package.json ${APP}/package-lock.json ./
RUN npm ci --include=dev
COPY ${APP}/ ./
RUN npm run build && npm prune --omit=dev
EXPOSE ${PORT}
CMD ["sh", "-c", "npx next start --port $PORT"]
