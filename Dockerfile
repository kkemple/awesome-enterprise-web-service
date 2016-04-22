FROM node:argon

RUN mkdir -p usr/src/app

COPY package.json usr/src/app/package.json

WORKDIR /usr/src/app
RUN npm install

WORKDIR /
COPY . usr/src/app/

WORKDIR /usr/src/app
RUN npm run test:unit
RUN npm run compile

EXPOSE 8080
EXPOSE 8081

CMD ["npm", "start"]
