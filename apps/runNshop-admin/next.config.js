/** @type {import('next').NextConfig} */
const nextConfig = {
  // 게이트웨이(nginx) 하위 경로 배포용. 빌드 시점에 결정됨 (예: /admin). 로컬 개발은 빈 값.
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
}
module.exports = nextConfig
