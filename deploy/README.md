# Lightsail 인스턴스 배포 (docker compose)

구성: nginx(게이트웨이) → `/api` api · `/admin` admin · `/partner` partner · `/` mobile

## 최초 1회 (서버)
```bash
# Docker + compose 플러그인 설치 (Ubuntu)
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER   # 재로그인 필요

# 메모리 2GB 이하면 빌드 중 OOM 방지용 swap 추가
sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile
sudo mkswap /swapfile && sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```
Lightsail 네트워킹 탭 방화벽에서 게이트웨이 포트(기본 80)를 연다.

## 배포 / 업데이트
```bash
git clone <저장소 URL> runNShop && cd runNShop     # 최초
git pull                                            # 업데이트
docker compose up -d --build
docker compose ps
```
- 포트 변경: `GATEWAY_PORT=8080 docker compose up -d --build`
- 로그: `docker compose logs -f api`

## 기존 runNShop 제거
```bash
cd <기존 runNShop 디렉터리>
docker compose down --rmi local     # 컨테이너·네트워크·로컬 빌드 이미지 제거
```
