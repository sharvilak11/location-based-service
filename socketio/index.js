var socketIO = require('socket.io');
var http = require('http');
var redis = require('redis');
var request = require('request-promise');

var helperMethods = require('./helper');
var redisHelpers = require('../redis');
var config = require('../config');

var socketPort = process.env.SOCKET_PORT;

module.exports = function (logger) {
    var module = {};
    var app = http.createServer();
    var io = socketIO(app);
    var redisClient = redis.createClient(
        {
            port: config.redis.port,
            host: config.redis.host,
            password: config.redis.password
        }
    );
    redisClient.on('connect', function () {
        console.log('Redis client is connected');
    });

    app.listen(socketPort, function () {
        console.log("Sockets started at " + process.env.SOCKET_PORT);
    });

    io.on('connection', function (socket) {
        // Do Authentication in Cab9 with access-token
        if (process.env.TEST == 1) {
            console.log('Socket connected ' + socket.id);
            helperMethods.initialise(io, socket, redisClient);
        }
        else
            authenticateSocket(socket);
    });

    function authenticateSocket(socket) {
        if (!socket.handshake.query || !socket.handshake.query.token) {
            return;
        }

        var token = socket.handshake.query.token.replace("Bearer ", "");

        redisHelpers.checkTokenKey(redisClient, token).then(function (found) {
            if (found) {
                console.log('Socket connected ' + socket.id);
                helperMethods.initialise(io, socket, redisClient);
            }
            else {
                var options = {
                    uri: config.cab9.api + 'api/track9/token',
                    json: true,
                    method: 'POST',
                    body: {
                        token: token
                    }
                };
                request(options).then(function (response) {
                    if (response) {
                        redisHelpers.storeTokenKey(redisClient, token).then(function () {
                            console.log('Socket connected ' + socket.id);
                            helperMethods.initialise(io, socket, redisClient);
                        }, function (err) {
                            console.log(err);
                            logger.logError(err);
                        })
                    }
                    else {
                        console.log("Access Token Not Found in cab9");
                        logger.logError("Access Token Not Found in cab9")
                    }
                }, function (err) {
                    logger.logError(err.message);
                });
            }
        });
    }

    return {
        io,
        redisClient
    }
}
