FROM node:12

WORKDIR /usr/src/
COPY ./package*.json ./
COPY ./docker/docker-entrypoint.sh ./
RUN npm install
# COPY ./ . 

ENTRYPOINT ["./app/docker/docker-test.entrypoint.sh"]