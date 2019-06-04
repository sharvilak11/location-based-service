var tripService = require('../services/TripService');
var driverService = require('../services/DriverService');
var redisHelpers = require('../redis');
var filters = require('../filters');

module.exports = function (app, io, client) {

    app.post('/api/starttrip', function (req, res) {
        tripService.startTrip(req.body,client).then(function (result) {
            return res.status(result.code).send(result.data);
        }, function (err) {
            return res.status(err.code).send(err.error);
        })
    })

    app.post('/api/completetrip', function (req, res) {
        tripService.completeTrip(req.body.bookingid, io, client).then(function (result) {
            return res.status(result.code).send(result.data);
        }, function (err) {
            return res.status(err.code).send(err.error);
        })
    });
};