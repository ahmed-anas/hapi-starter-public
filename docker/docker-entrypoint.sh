#!/bin/bash

cd /usr/src/app
npm run sequelize -- db:create
npm run migrate:dev
npm start || exit 1


