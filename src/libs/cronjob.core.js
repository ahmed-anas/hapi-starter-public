function runNewInstance(lastRun, functionToRun, interval) {
    var timeDifference = ((new Date()).getTime()) - lastRun;

    if (interval > timeDifference) {
        setTimeout(() => {
            scheduleCronjob(functionToRun, interval);
        }, interval - timeDifference);
    } else {
        scheduleCronjob(functionToRun, interval);
    }

    return null;
}

function scheduleCronjob(functionToRun, interval) {
    var lastRun = (new Date()).getTime();

    return functionToRun()
        .then(done => {
            return runNewInstance(lastRun, functionToRun, interval);
        })
        .catch(err => {
            console.error('error running cronjob', err);
            return runNewInstance(lastRun, functionToRun, interval);
        })
}

module.exports.runner = function () {
    var config = require('../../config/config');
    var path = require('path');
    
        config.getGlobbedFiles('./**/*cron.js').forEach(function (strategy) {
            let cronjob = require(path.resolve(strategy));
            return scheduleCronjob(cronjob.runner, cronjob.interval);
        });
    
};