FROM node:alpine AS development

ENV NODE_ENV development

WORKDIR /app

COPY package*.json /app

COPY src /app/src

COPY public /app/public

COPY server.js /app


COPY init.sql /docker-entrypoint-initdb.d/

RUN npm install util url path-browserify crypto-browserify querystring-es3 stream-http browserify-zlib stream-browserify buffer bcrypt

RUN npm install

EXPOSE 3000 3001

CMD  ["sh", "-c", "npm start & node server.js"]