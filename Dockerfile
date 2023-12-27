FROM node:alpine AS development

ENV NODE_ENV development

WORKDIR /app

COPY package.json /app

COPY /src /app/src

COPY /public /app/public

RUN npm install

EXPOSE 3000

CMD npm start