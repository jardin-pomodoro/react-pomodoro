FROM node:18 as node

WORKDIR /app
COPY ./frontend .

RUN npm install -g pnpm
RUN pnpm install
RUN pnpm run build

FROM nginx:alpine

EXPOSE 80

COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=node /app/dist /usr/share/nginx/html

ENTRYPOINT ["nginx", "-g", "daemon off;"]