# Awesome Enterprise Web service

An enterprise grade web service example

[![Code Climate](https://codeclimate.com/github/kkemple/awesome-enterprise-web-service/badges/gpa.svg)](https://codeclimate.com/github/kkemple/awesome-enterprise-web-service)
[![Test Coverage](https://codeclimate.com/github/kkemple/awesome-enterprise-web-service/badges/coverage.svg)](https://codeclimate.com/github/kkemple/awesome-enterprise-web-service/coverage)
[![Issue Count](https://codeclimate.com/github/kkemple/awesome-enterprise-web-service/badges/issue_count.svg)](https://codeclimate.com/github/kkemple/awesome-enterprise-web-service)
[![Circle CI](https://circleci.com/gh/kkemple/awesome-enterprise-web-service.svg?style=svg)](https://circleci.com/gh/kkemple/awesome-enterprise-web-service)

## Getting Started

### Project Setup

Install Docker and DNS management tools via Phase2 Devtools

Devtools makes working with Docker locally a much easier process. If you already have a Docker Machine running stop it first, and then run...

```bash
brew tap phase2/devtools
brew install phase2/docker-machine
brew install phase2/docker-compose
brew install phase2/docker
devtools start
```


This will start the dev Docker machine and also start up DnsDock and DnsMasq. With these we can assign domain names to our containers.

> Devtools also adjusts your host routing table and sets up a resolver for routing the `.vm` domain to the Docker Machine IP. This lets you access all of your containers from both the host and within the Docker machine by the same domain name.


## Run Tests

```bash
# start docker machine via devtools (devtools start)

# stop dev dependencies if running
# ./docker-stop-dev-dependencies.sh

$ ./docker-start-test-dependencies.sh
$ ./docker-run-test.sh
```


## Run Services

```bash
# start docker machine via devtools (devtools start)

# stop test dependencies if running
# ./docker-stop-test-dependencies.sh

$ ./docker-start-dev-dependencies.sh
$ ./docker-run-dev.sh
```


## Environment Variables
```bash
HOST
HTTP_PORT
TCP_PORT
SECRET
NODE_ENV
MYSQL_HOST
MYSQL_PORT
MYSQL_DATABASE
MYSQL_USERNAME
REDIS_HOST
REDIS_PORT
REDIS_PARTITION
STATSD_HOST
STATSD_PREFIX
```


### Web Service and Plugins

The web service is a Hapi application with an API and socket support. It uses the following plugins:

```json
{
  "hapi-auth-basic": "^4.1.0",
  "hapi-auth-jwt2": "^5.8.0",
  "hapi-statsd": "^5.0.0",
  "hapi-swagger": "^5.0.1",
  "inert": "^3.2.0",
  "vision": "^4.1.0"
}
```

### Data Management

This project is set to you mysql but that could easily be replaced by Postgres or MongoDB. Sequelize is used for migrations/seeds and as an ORM internally (see DB plugin for more info).

Available migration and seed NPM commands...

```json
{
  "db:migrate": "sequelize db:migrate",
  "db:migrate:undo": "sequelize db:migrate:undo",
  "db:migrate:undo:all": "sequelize db:migrate:undo:all",
  "db:seed": "sequelize db:seed",
  "db:seed:all": "sequelize db:seed:all",
  "db:seed:undo": "sequelize db:seed:undo",
  "db:seed:undo:all": "sequelize db:seed:undo:all",
  "migration:create": "sequelize migration:create",
  "seed:create": "sequelize seed:create"
}
```

See [sequelize docs](http://docs.sequelizejs.com/en/latest/docs/migrations/) for more info.

### Authentication and Authorization

### Code Quality and Testing

### Monitoring and Metrics

### Deployment

### API Documentation

### NPM Run Scripts

```json
{
  "db:migrate": "sequelize db:migrate",
  "db:migrate:undo": "sequelize db:migrate:undo",
  "db:migrate:undo:all": "sequelize db:migrate:undo:all",
  "db:seed": "sequelize db:seed",
  "db:seed:all": "sequelize db:seed:all",
  "db:seed:undo": "sequelize db:seed:undo",
  "db:seed:undo:all": "sequelize db:seed:undo:all",
  "migration:create": "sequelize migration:create",
  "seed:create": "sequelize seed:create",
  "serve": "nodemon",
  "lint": "eslint .",
  "start": "node lib/index.js",
  "compile": "rimraf lib && babel src --out-dir lib --source-maps inline",
  "pretest": "npm run lint",
  "test": "npm run db:migrate && npm run db:seed:all && istanbul cover tape -- -r babel-register \"src/**/*.test.js\"",
  "test:coverage": "npm run test && codeclimate-test-reporter < coverage/lcov.info",
  "pretest:unit": "npm run lint",
  "test:unit": "tape -r babel-register \"src/**/unit.test.js\""
}
```

### Dependencies

```json
{
  "bcryptjs": "^2.3.0",
  "bluebird": "^3.3.5",
  "catbox-redis": "^1.0.10",
  "good": "^6.6.0",
  "good-console": "^5.3.1",
  "hapi": "^13.3.0",
  "hapi-auth-basic": "^4.1.0",
  "hapi-auth-jwt2": "^5.8.0",
  "hapi-statsd": "^5.0.0",
  "hapi-swagger": "^5.0.1",
  "inert": "^3.2.0",
  "joi": "^8.0.5",
  "jsonwebtoken": "^5.7.0",
  "lodash.assign": "^4.0.8",
  "lodash.flattendeep": "^4.2.0",
  "lodash.omit": "^4.2.1",
  "lodash.reduce": "^4.3.0",
  "mysql": "^2.10.2",
  "newrelic": "^1.26.2",
  "sequelize": "^3.21.0",
  "sequelize-cli": "^2.3.1",
  "socket.io": "^1.4.5",
  "socketio-jwt": "^4.3.4",
  "uuid": "^2.0.2",
  "vision": "^4.1.0"
}
```

### Dev Dependencies

```json
{
  "babel-cli": "^6.7.5",
  "babel-preset-es2015": "^6.6.0",
  "babel-register": "^6.7.2",
  "eslint": "^2.8.0",
  "eslint-config-airbnb": "^7.0.0",
  "eslint-plugin-react": "^4.3.0",
  "istanbul": "^1.0.0-alpha.2",
  "nock": "^8.0.0",
  "nodemon": "^1.9.1",
  "rimraf": "^2.5.2",
  "sinon": "^1.17.3",
  "tape": "^4.5.1"
}
```
