FROM node:13.7.0 as build
WORKDIR /app

COPY ./package.json ./package-lock.json ./
RUN npm i

COPY ./public public
RUN rm -r public/img
COPY ./src src

RUN npm run build

FROM nissy34/static-file-server

COPY --from=build /app/build /web/home-manager
COPY ./static /web
COPY ./public/img /web/img

ENV SPA=true SPA_ROOT=home-manager 
