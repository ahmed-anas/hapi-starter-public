FROM node:12

WORKDIR /usr/src/
COPY ./package*.json ./
COPY ./docker/docker-test.entrypoint.sh ./
RUN npm install

RUN ["chmod", "+x", "./docker-test.entrypoint.sh"]
ENTRYPOINT ["./docker-test.entrypoint.sh"]
