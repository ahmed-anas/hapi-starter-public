FROM node:12

WORKDIR /usr/src/
COPY ./package*.json ./
COPY ./docker/docker-entrypoint.sh ./
RUN npm install
# COPY ./ . 


RUN ["chmod", "+x", "./app/docker/docker-test.entrypoint.sh"]
ENTRYPOINT ["./app/docker/docker-test.entrypoint.sh"]