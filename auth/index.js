var config = require('../config');
var request = require('request-promise');

var redisHelpers = require('../redis');

module.exports = function (client) {
    return function (req, res, next) {
        if(!req.headers.authorization){
            return res.status(401).send("Unauthorized")
        }
        var token = req.headers.authorization.replace("Bearer ", "");
        redisHelpers.checkTokenKey(client, token).then(function (found) {
            if (found) {
                next();
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
                    redisHelpers.storeTokenKey(client,token,response).then(function () {
                        return next();
                    }, function (err) {
                        return res.status(500).send(err);
                    })
                }, function (err) {
                   return res.status(err.statusCode).send(err.message);
                });
            }
        });
    }
};