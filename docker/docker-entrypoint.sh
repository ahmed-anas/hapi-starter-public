#!/bin/bash

cd /usr/src
npm run sequelize -- db:create
npm run migrate:dev
cd app 
npm start

touch foobar.txt

