# Awesome Enterprise Web service

An enterprise grade web service example

[![Code Climate](https://codeclimate.com/github/kkemple/awesome-enterprise-web-service/badges/gpa.svg)](https://codeclimate.com/github/kkemple/awesome-enterprise-web-service)
[![Test Coverage](https://codeclimate.com/github/kkemple/awesome-enterprise-web-service/badges/coverage.svg)](https://codeclimate.com/github/kkemple/awesome-enterprise-web-service/coverage)
[![Issue Count](https://codeclimate.com/github/kkemple/awesome-enterprise-web-service/badges/issue_count.svg)](https://codeclimate.com/github/kkemple/awesome-enterprise-web-service)
[![Circle CI](https://circleci.com/gh/kkemple/awesome-enterprise-web-service.svg?style=svg)](https://circleci.com/gh/kkemple/awesome-enterprise-web-service)

## Getting Started

### Project Setup

### Server and Plugins

### Data Management

### Authentication and Authorization

### Code Quality and Testing

### Deployment

### Monitoring and Metrics

## Run Tests

```bash
# stop dev dependencies if running
# ./docker-stop-dev-dependencies.sh

$ ./docker-start-test-dependencies.sh
$ ./docker-run-test.sh
```

## Run Services

```bash
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
