FROM node:12

WORKDIR /usr/src/
COPY ./package*.json ./
COPY ./docker/docker-entrypoint.sh ./
RUN npm install
# COPY ./ . 

RUN ["chmod", "+x", "./docker-entrypoint.sh"]

ENTRYPOINT ["./docker-entrypoint.sh"]