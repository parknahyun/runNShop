#!/bin/bash
# runNshop-mobile 실행 스크립트
# API 서버 상태 확인 후 프론트엔드 실행

APP_DIR="$(cd "$(dirname "$0")/../apps/runNshop-mobile" && pwd)"
API_URL="http://localhost:8080/api/v1/display/pages/home"

echo "🏃 runNshop-mobile 시작..."
echo ""

# API 서버 확인
echo "📡 API 서버 상태 확인 중..."
if curl -s -o /dev/null -w "%{http_code}" "$API_URL" | grep -q "200"; then
  echo "✅ API 서버 정상 (http://localhost:8080)"
else
  echo "❌ API 서버에 연결할 수 없습니다."
  echo "   먼저 API 서버를 실행해주세요:"
  echo "   cd api/runNshop-api && ./gradlew bootRun"
  echo ""
  read -p "API 없이 계속 실행하시겠습니까? (y/N) " answer
  if [ "$answer" != "y" ] && [ "$answer" != "Y" ]; then
    exit 1
  fi
fi

echo ""

# node_modules 확인
if [ ! -d "$APP_DIR/node_modules" ]; then
  echo "📦 의존성 설치 중..."
  cd "$APP_DIR" && npm install
fi

# 실행
echo "🚀 플랫폼 고객웹 실행 → http://localhost:3000"
cd "$APP_DIR" && npm run dev
