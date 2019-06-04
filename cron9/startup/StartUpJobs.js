var listOfJobs = require("../jobs/index");
var startJob = require('../jobs/StartJob');
var Jobs = require('../models/CronJob').model;

var query;

var startupJobs = function () {
    for (var key in listOfJobs) {
        query = {
            Name: key
        };
        if (listOfJobs.hasOwnProperty(key)) {
            Jobs.findOne(query, function (err, job) {
                if (err || !job) {

                } else {
                    startJob(job, 'Schedule');
                }
            })
        }
    }
}
module.exports = startupJobs;