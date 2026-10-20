#!/bin/bash
# Lightsail 컨테이너 서비스 배포: 이미지 빌드 → 푸시 → 배포(deployment) 생성
# 사전 준비: Docker 실행 중, AWS CLI + lightsailctl 설치, aws configure 완료
# 사용: SERVICE_NAME=runNShop REGION=ap-northeast-2 ./deploy/lightsail/deploy.sh
set -euo pipefail

SERVICE_NAME="${SERVICE_NAME:-runNShop}"
REGION="${REGION:-ap-northeast-2}"
POWER="${POWER:-small}"
SCALE="${SCALE:-1}"
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
AWS="aws --region $REGION"

# 서비스가 없으면 생성 (생성 후 READY 까지 몇 분 걸린다)
if ! $AWS lightsail get-container-services --service-name "$SERVICE_NAME" >/dev/null 2>&1; then
  echo "▶ 컨테이너 서비스 생성: $SERVICE_NAME ($POWER x $SCALE)"
  $AWS lightsail create-container-service --service-name "$SERVICE_NAME" --power "$POWER" --scale "$SCALE" >/dev/null
  until [ "$($AWS lightsail get-container-services --service-name "$SERVICE_NAME" --query 'containerServices[0].state' --output text)" = "READY" ]; do
    echo "  서비스 준비 대기..."; sleep 15
  done
fi

build_push() { # label, build args...
  local label="$1"; shift
  docker build -t "runnshop-$label" "$@"
  $AWS lightsail push-container-image --service-name "$SERVICE_NAME" --label "$label" --image "runnshop-$label" \
    | sed -n 's/.*Refer to this image as "\(.*\)" in deployments.*/\1/p'
}

echo "▶ 이미지 빌드/푸시"
API_IMG=$(build_push api "$ROOT/api/runNshop-api")
MOBILE_IMG=$(build_push mobile -f "$ROOT/apps/Dockerfile" --build-arg APP=runNshop-mobile --build-arg PORT=3000 "$ROOT/apps")
ADMIN_IMG=$(build_push admin -f "$ROOT/apps/Dockerfile" --build-arg APP=runNshop-admin --build-arg PORT=3001 --build-arg BASE_PATH=/admin "$ROOT/apps")
PARTNER_IMG=$(build_push partner -f "$ROOT/apps/Dockerfile" --build-arg APP=runNshop-partner --build-arg PORT=3002 --build-arg BASE_PATH=/partner "$ROOT/apps")
GATEWAY_IMG=$(build_push gateway "$ROOT/deploy/nginx")

CONTAINERS=$(cat <<JSON
{
  "api":     {"image": "$API_IMG",     "ports": {"8080": "HTTP"}},
  "mobile":  {"image": "$MOBILE_IMG",  "ports": {"3000": "HTTP"}},
  "admin":   {"image": "$ADMIN_IMG",   "ports": {"3001": "HTTP"}},
  "partner": {"image": "$PARTNER_IMG", "ports": {"3002": "HTTP"}},
  "gateway": {"image": "$GATEWAY_IMG", "ports": {"80": "HTTP"},
              "environment": {"API_HOST": "127.0.0.1", "MOBILE_HOST": "127.0.0.1", "ADMIN_HOST": "127.0.0.1", "PARTNER_HOST": "127.0.0.1"}}
}
JSON
)
ENDPOINT='{"containerName":"gateway","containerPort":80,"healthCheck":{"path":"/","intervalSeconds":10,"timeoutSeconds":5,"healthyThreshold":2,"unhealthyThreshold":5,"successCodes":"200-399"}}'

echo "▶ 배포 생성"
$AWS lightsail create-container-service-deployment --service-name "$SERVICE_NAME" \
  --containers "$CONTAINERS" --public-endpoint "$ENDPOINT" >/dev/null

echo "✅ 배포 요청 완료. 상태/URL 확인:"
echo "   aws --region $REGION lightsail get-container-services --service-name $SERVICE_NAME --query 'containerServices[0].[state,url]' --output text"
