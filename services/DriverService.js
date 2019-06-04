var Shift = require('../models/Shift').model;

var redisHelpers = require('../redis');
var helper = require('../filters/helper');
var locationService = require('../services/LocationService');
var shiftService = require('../services/ShiftService');

function getNearestDrivers(tenant, location) {
    return new Promise(function (resolve, reject) {
        if (!tenant || !location) {
            return reject({
                error: 'Bad Request',
                code: 400
            })
        }
        var query = {
            LastSeenLocation: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: location
                    },
                    $maxDistance: 15000
                }
            },
            Status: "ONLINE",
            TenantId: tenant,
            Timestamp: {
                $gt: Date.now() - 600000
            }
        };

        var project = {
            DriverId: 1,
            LastSeenLocation: 1
        };

        Shift.find(query, project).limit(5).exec(function (err, shifts) {
            if (err) {
                return reject({
                    code: 500,
                    error: err
                })
            }
            else {
                resolve({
                    code: 200,
                    data: shifts
                });
            }
        })
    })
}

function offlineDriver(client, location, io) {
    return new Promise(function (resolve, reject) {
        if (!location) {
            return reject({
                code: 400,
                error: 'Bad Request'
            });
        }

        shiftService.findOrCreateShift(location, 'OFFLINE').then(function (shift) {
            shift.ShiftEndTime = new Date();
            shift.Status = 'OFFLINE';
            shift.save(function (err) {
                if (err) {
                    return reject({
                        code: 500,
                        error: err
                    })
                }
                redisHelpers.removeDriver(client, location).then(function () {
                    io.to("LIVE_" + shift.TenantId).emit("REMOVEDRIVER", shift.DriverId);
                    io.to("NORMAL_" + shift.TenantId).emit("REMOVEDRIVER", shift.DriverId);

                    locationService.refineAndSaveLocations(client, location.DriverId).then(function (result) {
                        resolve({
                            code: 200,
                            data: result
                        })
                    })
                }, function (err) {
                    return reject({
                        code: 500,
                        error: err
                    })
                })
            })
        })
    });
}

function onlineDriver(client, location, io) {
    return new Promise(function (resolve, reject) {
        if (!location) {
            return reject({
                code: 400,
                error: 'Bad Request'
            });
        }
        redisHelpers.storeDriver(client, location).then(function () {
            shiftService.findOrCreateShift(location, "ONLINE").then(function (shift) {
                io.to("LIVE_" + location.TenantId).emit("ADDDRIVER", location);
                io.to("NORMAL_" + location.TenantId).emit("ADDDRIVER", location);
                shift.ShiftStartTime = new Date();
                shift.ShiftEndTime = undefined;
                shift.LastJobEndTime = undefined;
                shift.Status = 'ONLINE';
                shift.save(function (err) {
                    if (err) {
                        return reject({
                            code: 500,
                            error: err
                        })
                    }
                    resolve({
                        code: 200,
                        data: shift
                    })
                })
            }, function (err) {
                return reject({
                    code: 500,
                    error: err
                })
            });
        }, function (err) {
            return reject({
                code: 500,
                error: err
            })
        });
    });
}

function fetchDriverDetails(location) {
    return new Promise(function (resolve, reject) {
        if (!location.DriverId) {
            return reject({
                code: 400,
                error: 'Bad Request'
            });
        }

        var query = {
            DriverId: location.DriverId,
        };

        Shift.findOne(query, function (err, shift) {
            if (err) {
                return reject({
                    code: 500,
                    error: err
                })
            }
            else if (!shift) {
                return undefined;
            }

            location.DriverStatus = shift.Status;
            location.EmptyTime = ((shift.ShiftEndTime || Date.now()) - (shift.LastJobEndTime || shift.ShiftStartTime));
            location.ShiftTime = Date.now() - shift.ShiftStartTime;

            resolve(location);
        })
    });
}

function getNearbyDriversForBooking(tenant, location) {
    return new Promise(function (resolve, reject) {
        if (!tenant || !location) {
            return reject({
                error: 'Bad Request',
                code: 400
            })
        }
        var query = {
            LastSeenLocation: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: location
                    }
                }
            },
            Status: "ONLINE",
            TenantId: tenant,
            Timestamp: {
                $gt: Date.now() - 600000
            }
        };

        var project = {
            DriverId: 1,
            LastSeenLocation: 1
        };

        Shift.find(query, project).limit(20).exec(function (err, shifts) {
            if (err) {
                return reject({
                    code: 500,
                    error: err
                })
            }
            else {
                for (var i = 0; i < shifts.length; i++) {
                    shifts[i] = shifts[i].toObject();
                    shifts[i].Distance = helper._calculateGreatCircleDistance({
                        Longitude: location[0],
                        Latitude: location[1]
                    }, {
                        Longitude: shifts[i].LastSeenLocation.coordinates[0],
                        Latitude: shifts[i].LastSeenLocation.coordinates[1]
                    }) * 0.000621371;
                }
                resolve({
                    code: 200,
                    data: shifts
                });
            }
        })
    })
}


module.exports = {
    getNearestDrivers,
    offlineDriver,
    onlineDriver,
    fetchDriverDetails,
    getNearbyDriversForBooking
}