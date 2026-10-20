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

## 문서 사이트 (docsify)
- 주소: `http://<서버IP>/docs/` — `docs/` 마크다운을 docsify로 서빙. 사이드바는 빌드 시 `scripts/gen-docs-sidebar.js`가 디렉터리 트리로 생성한다 (`docs/_sidebar.md`, git 제외).
- PlantUML 다이어그램은 외부(plantuml.com)로 보내지 않고 compose의 `plantuml` 컨테이너(`/plantuml/`)가 렌더링한다. 메모리 상한 512MB.
- 문서를 수정하면 서버에서 `git pull && docker compose up -d --build docs` 로 반영한다.
- 로컬에서 `npx docsify-cli serve docs` 로 볼 때는 먼저 `node scripts/gen-docs-sidebar.js` 를 실행하고,
  PlantUML 은 `docker run -p 8081:8080 plantuml/plantuml-server:jetty-v1.2026.8` 를 띄워 두면 보인다.
- **인증(basic auth)**: `/docs/`, `/plantuml/` 은 비밀번호가 필요하다. 계정은 저장소 루트의 `.env`(git 제외)에 둔다.
  ```bash
  cp .env.example .env && nano .env      # DOCS_USER, DOCS_PASSWORD 설정
  docker compose up -d --build           # 게이트웨이 재생성되며 계정 반영
  ```
  `DOCS_PASSWORD` 가 비어 있으면 게이트웨이가 기동하지 않는다(인증 없이 열리지 않도록). 비밀번호 변경도 `.env` 수정 후 `docker compose up -d gateway`.
- `/`, `/admin`, `/partner`, `/api` 는 인증 대상이 아니다.
