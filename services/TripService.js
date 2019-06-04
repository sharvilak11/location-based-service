var redisHelpers = require('../redis');
var filters = require('../filters');

var locationService = require('../services/LocationService');

var Shift = require('../models/Shift').model;
var Booking = require('../models/Booking').model;

function startTrip(bookingObj, client) {
    return new Promise(function (resolve, reject) {
        if (!bookingObj) {
            return reject({
                code: 400,
                error: 'Bad Request'
            })
        }
        var booking = new Booking(bookingObj);
        booking.save(function (err, savedBooking) {
            if (err) {
                return reject({
                    code: 500,
                    error: err
                });
            }
            else {
                locationService.refineAndSaveLocations(client, savedBooking.DriverId).then(function () {
                    var query = {
                        DriverId: savedBooking.DriverId
                    }
                    Shift.findOne(query, function (err, shift) {
                        if (err) {
                            return reject({
                                code: 500,
                                error: err
                            })
                        }
                        else {
                            shift.Status = 'ONJOB';
                            shift.save(function (err) {
                                if (err) {
                                    return reject({
                                        code: 500,
                                        error: err
                                    })
                                }
                                else {
                                    resolve({
                                        code: 200,
                                        data: shift
                                    })
                                }
                            })
                        }
                    })
                }, function (err) {
                    return reject({
                        code: 500,
                        error: err
                    });
                })
            }
        });
    })
}

function completeTrip(bookingId, io, client) {
    return new Promise(function (resolve, reject) {
        if (!bookingId) {
            return reject({
                code: 400,
                error: 'Bad Request'
            });
        }

        var query = {
            BookingId: bookingId
        }
        Booking.findOne(query, function (err, booking) {
            if (err) {
                return reject({
                    code: 500,
                    error: err
                })
            }
            else if (!booking) {
                return reject({
                    code: 404,
                    error: 'Booking Not Found'
                })
            }
            else {
                var driverId = booking.DriverId;
                var clientSockets = io.sockets.adapter.rooms[driverId] ? io.sockets.adapter.rooms[driverId].sockets : [];
                for (var socketId in clientSockets) {
                    io.sockets.sockets[socketId].leave(driverId);
                }

                redisHelpers.getLocationsByDriver(client, driverId).then(function (locations) {
                    filters.refineLocations(locations).then(function () {
                        redisHelpers.deleteLocationsFromDriver(client, driverId).then(function () {
                            locationService.getPolyline(booking.BookingId).then(function (polyline) {
                                Shift.findOne({DriverId: booking.DriverId}, function (err, shift) {
                                    if (err) {
                                        return reject({
                                            code: 500,
                                            error: err
                                        });
                                    }
                                    else if (!shift) {
                                        return reject({
                                            code: 404,
                                            error: 'Shift Not Found'
                                        })
                                    }
                                    shift.Status = 'ONLINE';
                                    shift.LastJobEndTime = new Date();
                                    shift.save(function (err, s) {
                                        if (err) {
                                            return reject({
                                                code: 500,
                                                error: err
                                            })
                                        }
                                        booking.Polyline = polyline.data;
                                        booking.EndDateTime = Date.now();
                                        booking.save(function (err, savedBooking) {
                                            if (err) {
                                                return reject({
                                                    code: 500,
                                                    error: err
                                                });
                                            }
                                            else {
                                                resolve({
                                                    code: 200,
                                                    data: savedBooking
                                                })
                                            }
                                        });
                                    })
                                })
                            }, function (err) {
                                return reject({
                                    code: err.code,
                                    error: err.error
                                });
                            });
                        }, function (err) {
                            return reject({
                                code: 500,
                                error: err
                            });
                        });
                    }, function (err) {
                        return reject({
                            code: err.code,
                            error: err.error
                        });
                    });
                }, function (err) {
                    return reject({
                        code: 500,
                        error: err
                    });
                });
            }
        });
    });
}

module.exports = {
    startTrip,
    completeTrip
}