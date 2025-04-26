FROM node:22.14.0-bullseye

WORKDIR /app

RUN apt-get update

RUN npm config set registry http://registry.npmjs.org

ADD package.json /app/package.json

ADD package-lock.json /app/package-lock.json

RUN npm ci

ADD . /app

EXPOSE 5900 9229
