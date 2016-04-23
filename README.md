# Awesome Enterprise Web Service

An enterprise grade web service example

[![Code Climate](https://codeclimate.com/github/kkemple/awesome-enterprise-web-service/badges/gpa.svg)](https://codeclimate.com/github/kkemple/awesome-enterprise-web-service)
[![Test Coverage](https://codeclimate.com/github/kkemple/awesome-enterprise-web-service/badges/coverage.svg)](https://codeclimate.com/github/kkemple/awesome-enterprise-web-service/coverage)
[![Issue Count](https://codeclimate.com/github/kkemple/awesome-enterprise-web-service/badges/issue_count.svg)](https://codeclimate.com/github/kkemple/awesome-enterprise-web-service)
[![Circle CI](https://circleci.com/gh/kkemple/awesome-enterprise-web-service.svg?style=svg)](https://circleci.com/gh/kkemple/awesome-enterprise-web-service)

There are plenty of web application examples on the internet, but a lot of them leave you in the dark when it comes to things like data management, authorization and token distribution. There are virtually no solid examples of that from top to bottom. This project aims to be a starting point that allows you to spin up enterprise ready applications with minimal effort.

## Getting Started

### Project Setup

**Install Docker and DNS management tools via Phase2 [devtools](http://phase2.github.io/devtools/)**

Devtools is essentially a Docker machine manager... on steriods.

Some of the benefits of using `devtools` are:

```yaml
- Persistent Data w/ Back Up Support
- DNS Management between host and virtual machine
- Domain name aliasing for easier container-to-container communication **AND** host-to-virtual communication (http://<prefix>.<domain>.vm)
- Faster file syncing via NFS
```

> Devtools will also set up a resolver for routing the `.vm` domain to the Docker Machine IP. This lets you access all of your containers from both the host and within the Docker machine by the same domain name. This makes working with distributed systems a lot easier and keeps apps cleaner by removing the need for Docker specific environment variables.


```bash
brew tap phase2/devtools

brew install phase2/devtools

devtools doctor

# if problems from doctor command install recommended binaries
brew install phase2/devtools/docker-machine
brew install phase2/devtools/docker-compose
brew install phase2/devtools/docker

# stop docker-machine dev if it's already running
devtools start
```

> If you run `docker ps` you will see you already have two running containers, dnsdock and dnsmasq.


#### Run Tests

```bash
# start docker machine via devtools
# devtools start

# stop dev dependencies if running
# ./docker-stop-dev-dependencies.sh

./docker-start-test-dependencies.sh
./docker-run-test.sh
```


#### Run Docker Services

```bash
# start docker machine via devtools
# devtools start

# stop test dependencies if running
# ./docker-stop-test-dependencies.sh

./docker-start-dev-dependencies.sh
./docker-run-dev.sh
```

_Endpoints_

```bash
http://local.webservice.vm:8080 #API
http://local.webservice.vm:8080/documentation #API Documentation
http://local.webservice.vm:8081 #Sockets
http://db.webservice.vm:3306 #MySQL
http://cache.webservice.vm:6379 #Redis
http://statsd.webservice.vm:8126 #statsd admin interface (no GUI)
http://statsd.webservice.vm #Graphite Interface for viewing statsd metrics
```
___

### Web Service and Plugins

The web service is a [Hapi](http://hapijs.com/) application with an API and sockets support.

The API is set to run on port `8080` and sockets on `8081` by default. This can be changed via the `HTTP_PORT` and `TCP_PORT` environment variables.

#### Community Plugins

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

- [hapi-auth-basic](https://github.com/hapijs/hapi-auth-basic)
- [hapi-auth-jwt2](https://github.com/dwyl/hapi-auth-jwt2)
- [hapi-statsd](https://github.com/mac-/hapi-statsd)
- [hapi-swagger](https://github.com/glennjones/hapi-swagger)
- [inert](https://github.com/hapijs/inert)
- [vision](https://github.com/hapijs/vision)


#### Custom Plugins

##### DB
The DB plugin is responsible for attaching the ORM and any Models to the `server.app` object. As well as connecting to the database.

_Models_

```yaml
- User
  - Hooks
    - beforeCreate: used to hash password before saving
    - beforeUpdate: used to hash password before saving
  - Static Methods
    - authenticate: used to authenticate a user via email and password
  - Instance Methods
    - toJSON: override toJSON to omit password in responses
    - activeTokens: gets all active tokens associated with a user
    - inactiveTokens: gets all inactive tokens associated with a user
- Token
  - Static Methods
    - tokenize: creates a token for a user
  - Instance Methods
    - isExpired: returns true if token is expired
```


##### Sockets
The sockets module is responsible for setting up secure connections to clients via [socket.io](http://socket.io). It supports the same JWT auth as the API so users can access either with the same token. Unauthorized users will have their sessions killed upon auth failure.


##### Hasher
The hasher plugin adds a [server method](http://hapijs.com/tutorials/server-methods) for hashing passwords (`server.methods.hash`).


##### Auth
The auth plugin is responsible for managing authentication and authorization. There is support for both JWT (JSON Web Token) and Basic authentication.
To access a secure endpoint via basic auth, the client must either add the basic auth header or format the url with auth information included. If using JWTs, the client must send the token in the `Authorization` header.

_Endpoints_

```bash
POST /api/authenticate
```

> This plugin also manages scopes that are attached to `User` roles. Using roles allows for finer grained control over API access. The rules engine is very simple (really just a lookup) but it could easily be replaced. For more info look at `src/plugins/api/auth/scopes.js`.


##### Metrics
This plugin exposes metrics endpoints for gathering monitoring information about the application and underlying server.

_Endpoints_

```bash
GET /api/healthcheck (auth: disabled)
GET /api/metrics (scopes: ['metrics:read'])
GET /api/metrics/uptime (scopes: ['metrics:read'])
GET /api/metrics/totalmem (scopes: ['metrics:read'])
GET /api/metrics/loadavg (scopes: ['metrics:read'])
GET /api/metrics/serverload (scopes: ['metrics:read'])
GET /api/metrics/serverload/eventloopdelay (scopes: ['metrics:read'])
GET /api/metrics/serverload/heapused (scopes: ['metrics:read'])
GET /api/metrics/serverload/memused (scopes: ['metrics:read'])
```

_Example Output_

```json
{
  "upTime": "2004s",
  "totalMem": "4143Mb",
  "loadAvg": [
    "Load: 0.01220703125, CPUs: 2",
    "Load: 0.072265625, CPUs: 2",
    "Load: 0.09716796875, CPUs: 2"
  ],
  "serverLoad": {
    "eventLoopDelay": "2.3214459996670485ms",
    "heapUsed": "45Mb",
    "memUsed": "79Mb"
  }
}
```


##### Users
The users plugin provides REST endpoints for basic CRUD operations on users.

_Endpoints_

```bash
GET /api/users (scopes: ['users:read'])
POST /api/users (scopes: ['users:create'])
GET /api/users/current (scopes: ['users:read:current'])
GET /api/users/current/tokens/active (scopes: ['users:read:current'])
GET /api/users/current/tokens/inactive (scopes: ['users:read:current'])
GET /api/users/{id} (scopes: ['users:read'])
GET /api/users/{id}/tokens/active (scopes: ['users:read'])
GET /api/users/{id}/tokens/inactive (scopes: ['users:read'])
PATCH /api/users/{id} (scopes: ['users:write'])
PUT /api/users/{id} (scopes: ['users:write'])
DELETE /api/users/{id} (scopes: ['users:delete'])
```
___


### Data Management

This project is set to use mysql but that could easily be replaced by Postgres or MongoDB. Sequelize is used for migrations/seeds and as an ORM internally (see DB plugin for more info). There is a default migration in `db/migrations` and a corresponding seeder file in `db/seeders`. To run them:

```bash
npm run db:migrate
npm run db:seed:all
```

> Sequelize cli uses `NODE_ENV` environment variable to determine what config to use. The cli looks at `db/config.js` for configuration options.

All available migration and seed NPM commands...

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

---

### Configuration

App configuration lives in `src/config.js`. In `src/index.js` the `NODE_ENV` is used to pull the config for the proper environment. However, you will notice that except for the local environment, most config properties reference environment variables. This is to protect your sensitive information.

> The configuration for this app was left simple because most companies will have their own way of handling configuration, you just need to make sure you adjust `src/index.js` accordingly.


### Authentication and Authorization

There are two layers of security for the web service, the first being authentication. Every route except for the `/api/healthcheck` endpoint are authenticated. They support both basic auth, and JSON web tokens (JWTs).

The second layer of defense is scopes. Hapi has built in support for specifying scopes at the route level, but they leave getting scopes onto the `req.auth.credentials` object up to the application developer. This has already been handled for you via the `Auth` plugin.

You can get as granular as you want with scopes. Scopes associate to a `User`'s role. This makes it easy to build groups of scopes that you can assign to users with little management.

> You can also see how scopes are add to `req.auth.credentials` at `src/plugins/api/auth/index.js#L30` or `src/plugins/api/auth/index.js#L46`.

_Scopes_

```json
{
  "user": [
    "users:read:current",
    "users:write:current",
  ],

  "admin": [
    "users:read:current",
    "users:write:current",
    "users:read",
    "users:write",
    "users:create",
    "metrics:read",
  ],

  "super": [
    "users:read:current",
    "users:write:current",
    "users:read",
    "users:write",
    "users:create",
    "users:delete",
    "metrics:read",
  ],
}
```
___


### Code Quality and Testing

In order to keep the code clean and well structured ESLint is used. Rules are based off of [Airbnb's](https://github.com/airbnb/javascript) style guide with some very minor modifications, see `.eslintrc` for config.

Testing is done with `tape`, `sinon`, and `nock` for mocking HTTP calls. There are separate NPM tasks for running units tests, running full test suite, and running full test suite with code coverage.

> You will need a database and redis instance running to run full test suite

_NPM Test Scripts_

```json
{
  "lint": "eslint .",
  "pretest": "npm run lint",
  "test": "npm run db:migrate && npm run db:seed:all && istanbul cover tape -- -r babel-register \"src/**/*.test.js\"",
  "test:coverage": "npm run test && codeclimate-test-reporter < coverage/lcov.info",
  "pretest:unit": "npm run lint",
  "test:unit": "tape -r babel-register \"src/**/unit.test.js\""
}
```

___


### Transpiling

Source code is transpiled by [Babel](https://babeljs.io) via `npm run compile`. Code compiles to the `lib` directory. Currently only the `ES2015` plugin is used.

___


### Monitoring and Metrics

This app includes New Relic for application monitoring, just add your application token in `newrelic.js` and adjust the app name.

#### Custom Metrics

The `server` object also has Statsd availble via `server.statsd`. Every request is also tracked by statsd. Read the docs for the [hapi-statd](https://github.com/mac-/hapi-statsd) plugin for all availble options.

**Example**

```javascript
{
  method: 'POST',
  path: '/api/authenticate',
  config: {
    tags: ['api', 'auth'],
    auth: false,
    validate: {
      payload: authenticationPayload,
    },
    handler(req, reply) {
      const { email, password } = req.payload
      const { User, Token } = req.server.app.models

      User.authenticate(email, password)
        .then((user) => Token.tokenize(user))
        .then((token) => {
          req.server.statsd.increment(`login.success.user.${user.id}`)

          reply({
            success: true,
            payload: { token },
          })
        })
        .catch((err) => {
          req.server.statsd.increment(`login.fail.user.${user.id}`)

          reply({
            success: false,
            error: err.name,
            message: err.message,
            stack: err.stack,
          }).code(401)
        })
    },
  },
}
```

### API Documentation
Documentation for the API is availble via [hapi-swagger](https://github.com/glennjones/hapi-swagger). Adding routes to the docs is as easy and adding the `api` tag to the route.

_Example_

```javascript
{
  method: 'POST',
  path: '/api/healthcheck',
  config: {
    tags: ['api'],
    auth: false,
    ...
  },
}
```

> [Swagger.io](http://swagger.io)

___


### Deployment
Deployment is really just a matter or preference. This application is using [Circle CI](https://circleci.com/gh/kkemple/awesome-enterprise-web-service) to run tests, build docker container, and push it to Docker Hub. See `circle.yml` for build, test, and deploy configuration.

___


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
___


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
  "codeclimate-test-reporter": "^0.3.1",
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
