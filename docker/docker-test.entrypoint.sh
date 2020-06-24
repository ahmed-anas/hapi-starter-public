#!/bin/bash

cd /usr/src
cd app 

if [ $USER == "jenkins" ] 
    echo "Running unit tests in Jenkins without watch"
    npm run unit-test -- --watch
else
    echo "Running unit tests with watch"
    npm run unit-test
fi
