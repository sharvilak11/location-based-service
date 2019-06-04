function storeDriver(client, location) {
    return new Promise(function (resolve, reject) {
        var args = [
            location.TenantId,
            location.DriverId
        ];

        client.sadd(args, function (err, response) {
            if (err) {
                console.log(err);
                return reject({
                    code: 500,
                    error: err
                })
            }
            resolve();
        });
    })
}

function storeLocations(client, location) {
    var args = [
        location.DriverId,
        location.Timestamp,
        JSON.stringify(location)
    ];
    client.zadd(args, function (err, response) {
        if (err) {
            console.log(err);
        }
    });
}

function getLocationsByDriver(client, driverId) {
    return new Promise(function (resolve, reject) {
        var args = [
            driverId,
            0,
            -1
        ];
        client.zrange(args, function (err, response) {
            if (err) {
                console.log(err);
                return reject(err);
            }
            else {
                resolve(response);
            }
        })
    });
}

function getLatestLocationOfDriver(client, driverId) {
    return new Promise(function (resolve, reject) {
        var args = [
            driverId,
            0,
            0
        ];
        client.zrevrange(args, function (err, response) {
            if (err) {
                console.log(err);
                return reject(err);
            }
            else {
                resolve(response);
            }
        })
    });
}

function getLocationsByTenant(client, tenantId) {
    return new Promise(function (resolve, reject) {
        client.sscan(tenantId, 0, function (err, replies) {
            if (err) {
                return reject(err);
            }
            else {
                var queue = [];
                var drivers = replies[1];
                for (var i = 0; i < drivers.length; i++) {
                    queue.push(_getLocations(client, drivers[i]));
                }
                Promise.all(queue).then(function (result) {
                    resolve(result)
                }, function (err) {
                    reject(err);
                })
            }
        })
    })
}

function _getLocations(redisClient, resource) {
    return new Promise(function (resolve, reject) {
        redisClient.zrevrange(resource, 0, 0, function (err, data) {
            if (err) {
                reject(err)
            }
            else if (data && data[0]) {
                resolve(JSON.parse(data[0]));
            }
            else {
                return reject("No Locations found for this resource");
            }
        });
    })
}

function deleteLocationsFromDriver(client, driverId) {
    return new Promise(function (resolve, reject) {
        if (!driverId) {
            return reject('DriverId can not be undefined')
        }
        var args = [
            driverId,
            '*'
        ];

        client.del(args, function (err, response) {
            if (err) {
                return reject(err);
            }
            else {
                resolve();
            }
        })
    });
}

function removeDriver(client, location) {
    return new Promise(function (resolve, reject) {
        var args = [
            location.TenantId,
            location.DriverId
        ];

        client.srem(args, function (err, response) {
            if (err) {
                console.log(err);
                return reject({
                    code: 500,
                    error: err
                })
            }
            resolve();
        })
    });
}

function checkTokenKey(client, token) {
    return new Promise(function (resolve, reject) {
        var args = [
            token
        ];

        client.exists(args, function (err, response) {
            if (err) {
                return reject({
                    code: 500,
                    error: err
                })
            }
            else if (response) {
                resolve(true);
            }
            else {
                resolve(false)
            }
        })
    })
}

function storeTokenKey(client, token, tokenObject) {
    return new Promise(function (resolve, reject) {
        var args = [
            token,
            1
        ];

        client.set(args, function (err, response) {
            if (err) {
                return reject({
                    code: 500,
                    error: err
                })
            }
            else {
                args = [
                    token,
                    new Date(tokenObject.expires_in).getTime() - Date.now()
                ];
                client.pexpire(args, function (err) {
                    if (err) {
                        return reject({
                            code: 500,
                            error: err
                        })
                    }
                    resolve(response);
                });
            }
        });
    });
}

module.exports = {
    storeDriver,
    storeLocations,
    getLocationsByDriver,
    getLatestLocationOfDriver,
    getLocationsByTenant,
    deleteLocationsFromDriver,
    removeDriver,
    checkTokenKey,
    storeTokenKey
};