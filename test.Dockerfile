FROM node:12

WORKDIR /usr/src/app
ENV NODE_ENV development
COPY ./package*.json ./
COPY ./docker/docker-test.entrypoint.sh ./
COPY ./ ./
RUN npm install
RUN ["chmod", "+x", "./docker-test.entrypoint.sh"]
ENTRYPOINT ["./docker-test.entrypoint.sh"]
