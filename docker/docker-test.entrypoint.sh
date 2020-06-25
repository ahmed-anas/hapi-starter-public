#!/bin/bash

cd /usr/src
cd app

if [ "$USER" == "jenkins" ]
then
    echo "Running unit tests in Jenkins without watch"
    npm run unit-test -- --watch || exit 1
else
    echo "Running unit tests with watch"
    npm run unit-test || exit 1
fi
