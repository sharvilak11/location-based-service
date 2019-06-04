var polyline = require('@mapbox/polyline');
var polylineExtended = require('polyline-extended');

function _calculateGreatCircleDistance(locationA, locationZ){
    var lat1 = locationA.Latitude;
    var lon1 = locationA.Longitude;
    var lat2 = locationZ.Latitude;
    var lon2 = locationZ.Longitude;

    var p1 = _toRadians(lat1);
    var p2 = _toRadians(lat2);
    var deltagamma = _toRadians(lon2 - lon1);
    var R = 6371e3; // gives d in metres
    var d = Math.acos(Math.sin(p1) * Math.sin(p2) + Math.cos(p1) * Math.cos(p2) * Math.cos(deltagamma)) * R;

    return isNaN(d) ? 0 : d;
}

function _calculateBearing(pointB,pointA) {
    var dLon = (pointB.Longitude - pointA.Longitude);
    var lat1 = (pointA.Latitude);
    var lat2 = (pointB.Latitude);
    var y = Math.sin(dLon) * Math.cos(lat2);
    var x = Math.cos(lat1)*Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    var bearing = _toDeg(Math.atan2(y, x));
    bearing = ((bearing + 360) % 360).toFixed(1);
    return bearing;
}

function _toRadians (number){
    return number * Math.PI / 180;
}

function _toDeg(rad) {
    return rad * 180 / Math.PI;
}


module.exports = {
    _calculateGreatCircleDistance,
    _calculateBearing,
    _toRadians,
}