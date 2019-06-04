/**
 * Created by sharvilak on 10/08/17.
 */
var cron = require('cron');
var mongoose = require('mongoose');
var CronJob = cron.CronJob;

var Log = require('../models/Logs').model;
var listOfJobs = require('./index');

require('dotenv').config();

var log;
var repeatCounter=0;

process.on('message',function(msg){

    console.log('child process created at '+process.pid);
    mongoose.connect(process.env.DATABASE, {
        useNewUrlParser: true
    });

    if(listOfJobs[msg.objJob.Name]){
        listOfJobs[msg.objJob.Name].jobFunction(msg.objJob);
    }

});

process.on('exit', function (code) {
    console.log('child process exited with code ' + code + ' At '+ process.pid);
    mongoose.disconnect();
});


