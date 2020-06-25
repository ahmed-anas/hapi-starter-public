#!/bin/bash
set -e

cd /usr/src/app
echo "user found $USER"
if [ "$USER" == "jenkins" ]
then
    echo "Running unit tests in Jenkins without watch"
    npm run unit-test
else
    echo "Running unit tests with watch"
    npm run unit-test -- --watch
fi

