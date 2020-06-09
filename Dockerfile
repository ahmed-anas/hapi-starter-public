# FROM mysql:5
FROM node:12

#ARG MYSQL_ALLOW_EMPTY_PASSWORD=yes
WORKDIR /usr/src/
COPY ./package*.json ./
COPY ./docker/docker-entrypoint.sh ./
RUN npm install
COPY ./ . 

ENTRYPOINT ["./docker/docker-entrypoint.sh"]

