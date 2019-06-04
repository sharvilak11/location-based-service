var mongoose = require('mongoose');
var redis = require('redis');
var redisHelpers = require('../redis');
var filters = require('../filters');

process.on('message', function (msg) {

    console.log('child process created at ' + process.pid);
    mongoose.connect(process.env.DATABASE, {
        useNewUrlParser: true
    });

    var redisClient = redis.createClient();
    redisClient.on('connect', function () {
        redisHelpers.getLocationsByDriver(redisClient).then(function (locations) {
            if (locations && locations.length > 0) {
                filters.refineLocations(locations).then(function (filteredLocations) {
                    redisHelpers.updateDriversSet(redisClient,filteredLocations).then(function(){
                        redisHelpers.deleteLocationsFromDriver(redisClient,filteredLocations).then(function(){
                            redisClient.quit();
                            process.exit(0);
                        }, function(err){
                            process.exit(1);
                        })
                    }, function(err){
                        process.exit(1);
                    });
                }, function(err){
                    process.exit(1);
                })
            }
            else {
                redisClient.quit();
                process.exit(0);
            }
        }, function(err){
            console.log(err);
            process.exit(1);
        });
    });
});

process.on('exit', function (code) {
    console.log('child process exited with code ' + code + ' At ' + process.pid);
    mongoose.disconnect();
});