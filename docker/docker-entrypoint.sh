#!/bin/bash
set -e

cd /usr/src/app
npm run sequelize -- db:create
npm run migrate:dev
npm start


