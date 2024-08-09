

# 1단계: 의존성 설치 및 애플리케이션 빌드
FROM node:22-alpine as builder

# 작업 디렉토리 설정
WORKDIR /app

# 패키지 파일 복사
COPY front/. ./front/.
COPY shared/. ./shared/.

WORKDIR ./front/

# 의존성 설치
RUN  npm install  &&  npm run build 


# 2단계: 실행 이미지
WORKDIR ./front/
EXPOSE 3000
CMD ["node", "server.js"]
