FROM node:alpine as build
WORKDIR /usr/app

COPY . /usr/app
RUN npm ci

EXPOSE 3000

CMD ["node", "StartDirectorServer.js"]