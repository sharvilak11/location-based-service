var helper = require('./helper');
var config = require('../config');

function discard(location,lastLocation,lastBearing){
    if(!lastLocation)
        return false;

    var distByGPS = helper._calculateGreatCircleDistance(location, lastLocation);
    var bearing = helper._calculateBearing(location,lastLocation);
    if(Math.abs(bearing - lastBearing) > config.filters.discard.bearing){
        return false;
    }
    else if(distByGPS > config.filters.discard.distance){
        return false;
    }
    else{
        return true;
    }
}

module.exports = discard;