var cron = require('cron');
var mongoose = require('mongoose');
var fork = require('child_process').fork;

var Log = require('../models/Logs').model;
var CronJob = cron.CronJob;

var log;
var repeatCounter = 0;
var job;
var Job;

job = new CronJob({
    cronTime: '00 10 20 * * 1-5',
    onTick: function () {
        Job = this.job;
        var child = fork('./cron9/jobs/ForkJob.js');
        child.send({objJob: Job});

    },
    start: false,
});


var processIdleDrivers = function (Job) {
    var redis = require('redis');
    var config = require('../../config');

    var Shift = require('../../models/Shift').model;

    var locationService = require('../../services/LocationService');
    var redisHelpers = require('../../redis');


    var log = new Log({
        JobId: Job._id
    });

    var query = {
        Timestamp: {
            $lt: Date.now() - 900000
        },
        Status: 'ONLINE'
    };

    var client = redis.createClient(
        {
            port: config.redis.port,
            host: config.redis.host,
            password: config.redis.password
        }
    );
    client.on('connect', function () {
        console.log('Redis client is connected');
    });

    Shift.find(query, function (err, shifts) {
        var queue = [];
        for (var i = 0; i < shifts.length; i++) {
            // process notification
            queue.push(locationService.refineAndSaveLocations(client, shifts[i].DriverId));
            shifts[i].Status = 'OFFLINE';
            shifts[i].ShiftEndTime = Date.now();
            queue.push(shifts[i].save());
        }
        Promise.all(queue).then(function (result) {
            logjob(log, 'SUCCESS', result.length/2);
            client.quit(function () {
                console.log("Redis Conn Quit");
            });
        });
    });
}

// Logger
function logjob(log, status, logMessage) {
    log.ModificationDate = new Date();
    if (status == 'FAIL') {
        log.Success = false;
        log.Comments = 'Retry Attempt:' + repeatCounter + '-' + logMessage;
        log.RecordsUpdated = -1;
    } else {
        log.Success = true;
        log.RecordsUpdated = logMessage;
        log.Comments = 'Successful in Attempt:' + repeatCounter;
    }
    console.log(log);
    log.save(function (err) {
        if (err) {
            console.log(err);
        } else {
            process.exit();
        }
    });
};

function retry(err) {
    if (repeatCounter < Job.NumberOfRetries) {
        repeatCounter++;
        logjob(log, 'FAIL', err.toString());
        setTimeout(function () {
            processIdleDrivers();
        }, 10 * 1000);
    } else {
        // Send Email of Failure
    }

};

module.exports = {
    job: job,
    jobFunction: processIdleDrivers
}



