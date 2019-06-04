var listOfJobs = require('./index')
var CronJob = require('cron').CronJob;
var CronTime = require('cron').CronTime;

var StartJob = function(job,runTime){
    var date;

    var Job = listOfJobs[job.Name].job;
    if (Job) {
        if (job.Active) {
            Job.context.job = job;
            if (runTime == 'Now') {
                date = new Date();
                date.setSeconds(date.getSeconds() + 2);
                Job.setTime(new CronTime(date));
                Job.start();
                setTimeout(function () {
                    Job.stop();
                    startScheduleRun();
                }, 10000);
            } else {
                startScheduleRun();
            }
        }
        else{
            Job.context.job = job;
            if (runTime == 'Now') {
                date = new Date();
                date.setSeconds(date.getSeconds() + 2);
                Job.setTime(new CronTime(date));
                Job.start();
                setTimeout(function () {
                    Job.stop();
                    startScheduleRun();
                }, 10000);
            }
        }
    }

    function startScheduleRun() {
        if (job.Cron) {
            Job.setTime(new CronTime(job.Cron));
            Job.runOnce = false;
        } else {
            Job.setTime(new CronTime(job.ScheduleDate));
            Job.runOnce = true;
        }
        Job.timeZone = job.Timezone;
        Job.start();
    }
}

module.exports = StartJob;
