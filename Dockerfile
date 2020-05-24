FROM node:13.7.0 as build
WORKDIR /app
COPY ./package.json ./package-lock.json ./
RUN npm i
COPY ./ ./
RUN npm run build

FROM nissy34/static-file-server

COPY --from=build /app/build /web/home-manager
COPY ./static /web

ENV SPA=true SPA_ROOT=home-manager 
