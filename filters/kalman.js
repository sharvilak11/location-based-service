var config = require('../config');
var helper = require('./helper');

function kalman(location,lastLocation,kalmanConstant,variance){
    var accuracy = Math.max(location.Accuracy || 20, 1);
    var bearing = 0;
    if(!lastLocation){
        variance = accuracy * accuracy;
    }
    else {
        const timestampInc = new Date(location.Timestamp).getTime() - new Date(lastLocation.Timestamp).getTime();

        if (timestampInc > 0) {
            const velocity = helper._calculateGreatCircleDistance(location, lastLocation) / timestampInc * kalmanConstant;
            variance += timestampInc * velocity * velocity / 1000;
        }

        const k = variance / (variance + accuracy * accuracy);
        location.Latitude += k * (location.Latitude - lastLocation.Latitude);
        location.Longitude += k * (location.Longitude - lastLocation.Longitude);
        variance = (1 - k) * variance;
        bearing = helper._calculateBearing(location,lastLocation)
    }
    return {
        location: location,
        variance: variance,
        bearing: bearing
    }
}

module.exports = kalman;