
FROM node:22-alpine AS base


WORKDIR /app

COPY back/main_sever/. ./back/main_sever/.
COPY shared/. ./shared/.



RUN cd ./back/main_sever && npm install &&  npm run build 


WORKDIR ./back/main_sever/
RUN npm prune --production

EXPOSE 3000

CMD ["node", "dist/main.js"]