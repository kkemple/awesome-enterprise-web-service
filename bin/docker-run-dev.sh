#! /bin/bash

docker-compose run webservice npm run db:migrate
docker-compose run webservice npm run db:seed:all
docker-compose up webservice
