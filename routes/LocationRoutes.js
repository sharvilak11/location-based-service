var locationService = require('../services/LocationService');
var redisHelpers = require('../redis');
var filters = require('../filters');

module.exports = function(app){
    app.get('/api/polyline', function(req,res){
        locationService.getPolyline(req.query.bookingid).then(function(result){
            return res.status(result.code).send(result.data);
        }, function(err){
            return res.status(err.code).send(err.error);
        })
    });
};