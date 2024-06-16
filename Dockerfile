FROM node:alpine AS development

ENV NODE_ENV development

WORKDIR /app

RUN apk update && apk add docker openrc
RUN rc-update add docker boot

COPY package*.json /app

COPY src /app/src

COPY defis /app/defis

COPY public /app/public

COPY server.js /app

COPY init.sql /docker-entrypoint-initdb.d/

COPY entrypoint.sh /app/entrypoint.sh

RUN chmod +x /app/entrypoint.sh

RUN npm install util url path-browserify crypto-browserify querystring-es3 stream-http browserify-zlib stream-browserify buffer bcrypt compressorjs

RUN npm install

EXPOSE 3000 3001

ENTRYPOINT ["/app/entrypoint.sh"]