var redisHelpers = require('../redis');
var filters = require('../filters');

var Location = require('../models/Location').model;

function getPolyline(bookingId) {
    return new Promise(function (resolve, reject) {
        if (!bookingId) {
            return reject({
                code: 400,
                error: 'Bad Request'
            });
        }
        else {
            var query = {
                BookingId: bookingId
            };

            Location.find(query, {"Longitude": 1, "Latitude": 1}, {sort: {Timestamp: 1}}, function (err, locations) {
                if (err) {
                    return reject({
                        code: 500,
                        error: err
                    });
                }
                else {
                    _createEncodings(locations).then(function (polyline) {
                        return resolve({
                            code: 200,
                            data: polyline
                        });
                    }, function (err) {
                        return reject({
                            code: 500,
                            error: err
                        })
                    })
                }
            });
        }
    });
}

function _createEncodings(coords) {
    return new Promise(function (resolve, reject) {
        var i = 0;

        var plat = 0;
        var plng = 0;

        var encoded_points = "";

        for (i = 0; i < coords.length; ++i) {
            var lat = coords[i].Latitude;
            var lng = coords[i].Longitude;

            encoded_points += _encodePoint(plat, plng, lat, lng);

            plat = lat;
            plng = lng;
        }

        resolve(encoded_points);
    })
}

function _encodePoint(plat, plng, lat, lng) {
    var late5 = Math.round(lat * 1e5);
    var plate5 = Math.round(plat * 1e5)

    var lnge5 = Math.round(lng * 1e5);
    var plnge5 = Math.round(plng * 1e5)

    dlng = lnge5 - plnge5;
    dlat = late5 - plate5;

    return _encodeSignedNumber(dlat) + _encodeSignedNumber(dlng);
}

function _encodeSignedNumber(num) {
    var sgn_num = num << 1;

    if (num < 0) {
        sgn_num = ~(sgn_num);
    }

    return (_encodeNumber(sgn_num));
}

function _encodeNumber(num) {
    var encodeString = "";

    while (num >= 0x20) {
        encodeString += (String.fromCharCode((0x20 | (num & 0x1f)) + 63));
        num >>= 5;
    }

    encodeString += (String.fromCharCode(num + 63));
    return encodeString;
}

function refineAndSaveLocations(client, driverId) {
    return new Promise(function (resolve, reject) {
        redisHelpers.getLocationsByDriver(client, driverId).then(function (locations) {
            filters.refineLocations(locations).then(function (filteredLocations) {
                redisHelpers.deleteLocationsFromDriver(client, driverId).then(function () {
                    resolve('Done');
                }, function(err){
                    return reject({
                        code: 500,
                        error: err
                    })
                });
            }, function (err) {
                return reject({
                    code: 500,
                    error: err
                });
            });
        }, function (err) {
            return reject({
                code: 500,
                error: err
            });
        });
    });
}

module.exports = {
    getPolyline,
    refineAndSaveLocations
};