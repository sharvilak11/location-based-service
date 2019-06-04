var driverService = require('../services/DriverService');
var redisHelpers = require('../redis');
var auth = require('../auth');

module.exports = function(app,io,client){
    app.post('/api/nearestdriversbylocation', function(req,res){
        driverService.getNearestDrivers(req.body.tenantid,req.body.location).then(function(result){
            return res.status(result.code).send(result.data);
        }, function(err){
            return res.status(err.code).send(err.error);
        })
    });

    app.post('/api/offlinedriver',function(req,res){
        driverService.offlineDriver(client,req.body,io).then(function(result){
            return res.status(result.code).send(result.data);
        }, function(err){
            return res.status(err.code).send(err.error);
        })
    });

    app.post('/api/onlinedriver', function(req,res){
        driverService.onlineDriver(client,req.body,io).then(function(result){
            return res.status(result.code).send(result.data);
        }, function(err){
            return res.status(err.code).send(err.error);
        })
    });

    app.post('/api/booking/nearbydrivers', function(req,res){
        driverService.getNearbyDriversForBooking(req.body.tenantid,req.body.location).then(function(result){
            return res.status(result.code).send(result.data);
        }, function(err){
            return res.status(err.code).send(err.error);
        })
    })

}