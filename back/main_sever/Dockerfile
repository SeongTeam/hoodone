FROM node:22-alpine as builder


WORKDIR /app

COPY back/main_sever/. ./back/main_sever/.
COPY shared/. ./shared/.

WORKDIR /app/back/main_sever

RUN npm install &&  npm run build 
RUN npm prune --production


FROM node:22-alpine 
WORKDIR /app/back/main_sever

# 빌드 단계에서 생성된 필수 파일만 복사
COPY --from=builder /app/back/main_sever/dist ./dist
COPY --from=builder /app/back/main_sever/node_modules ./node_modules
COPY --from=builder /app/back/main_sever/.env ./



EXPOSE 3000

CMD ["node", "dist/main.js"]