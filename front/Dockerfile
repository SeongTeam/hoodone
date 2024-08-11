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
FROM node:22-alpine
WORKDIR /app/front/

# 빌드 단계에서 생성된 필수 파일만 복사
COPY --from=builder /app/front/.next/standalone ./
COPY --from=builder /app/front/.next/static ./.next/static
COPY --from=builder /app/front/public ./public


EXPOSE 4000

ENV PORT 4000
ENV BACKEND_URL http://backend:3000

CMD ["node", "server.js"]
