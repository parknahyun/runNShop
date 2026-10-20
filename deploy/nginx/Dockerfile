FROM nginx:1.27-alpine
# /etc/nginx/templates/*.template 는 시작 시 환경변수가 치환되어 conf.d 로 렌더링된다
COPY default.conf.template /etc/nginx/templates/default.conf.template
