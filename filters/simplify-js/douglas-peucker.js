var helper = require('../helper');
var utmObj = require('utm-latlng');

// square distance from a point to a segment
function getSqSegDist(p, p1, p2) {
    var utm=new utmObj();
    var utmCoordinatep = utm.convertLatLngToUtm(p.Latitude,p.Longitude,1);
    var utmCoordinatep1 = utm.convertLatLngToUtm(p1.Latitude,p1.Longitude,1);
    var utmCoordinatep2 = utm.convertLatLngToUtm(p2.Latitude,p2.Longitude,1);

    p.x = utmCoordinatep.Easting;
    p.y = utmCoordinatep.Northing;

    p1.x = utmCoordinatep1.Easting;
    p1.y = utmCoordinatep1.Northing;

    p2.x = utmCoordinatep2.Easting;
    p2.y = utmCoordinatep2.Northing;

    var m = ( p2.y - p1.y ) / ( p2.x - p1.x ), //slope  m = y2-y1/x2-x1
    b = p1.y - ( m * p1.x ), // y = mx + c
    d = [];

    // distance to the linear equation
    d.push( Math.abs( p.y - ( m * p.x ) - b ) / Math.sqrt( Math.pow( m, 2 ) + 1 ) );

    // distance to p1
    d.push( Math.sqrt( Math.pow( ( p.x - p1.x ), 2 ) + Math.pow( ( p.y - p1.y ), 2 ) ) );

    // distance to p2
    d.push( Math.sqrt( Math.pow( ( p.x - p2.x ), 2 ) + Math.pow( ( p.y - p2.y ), 2 ) ) );

    // return the smallest distance
    return d.sort( function( a, b ) {
        return ( a - b ); //causes an array to be sorted numerically and ascending
    } )[0];
}

function simplifyDPStep(points, first, last, sqTolerance, simplified) {
    var maxSqDist = sqTolerance,
        index;

    for (var i = first + 1; i < last; i++) {
        var sqDist = getSqSegDist(points[i], points[first], points[last]);

        if (sqDist > maxSqDist) {
            index = i;
            maxSqDist = sqDist;
        }
    }

    if (maxSqDist > sqTolerance) {
        if (index - first > 1) simplifyDPStep(points, first, index, sqTolerance, simplified);
        simplified.push(points[index]);
        if (last - index > 1) simplifyDPStep(points, index, last, sqTolerance, simplified);
    }
}

// simplification using Ramer-Douglas-Peucker algorithm
module.exports = function simplifyDouglasPeucker(points, tolerance) {
    if (points.length<=1)
        return points;
    tolerance = typeof tolerance === 'number' ? tolerance : 1;
    var sqTolerance = tolerance * tolerance;
    
    var last = points.length - 1;

    var simplified = [points[0]];
    simplifyDPStep(points, 0, last, sqTolerance, simplified);
    simplified.push(points[last]);

    return simplified;
}
