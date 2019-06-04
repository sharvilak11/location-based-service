var socketIO = require('socket.io');
var tracking = require('./FakeTrack');
var http = require('http');

var socketPort = process.env.FAKE_SOCKET_PORT;
var trackNumber = {
    "driver1": 1,
    "driver2": 2,
    "driver3": 3,
    "driver4": 4,
    "driver5": 5,
    "driver6": 6,
    "driver7": 7,
    "driver8": 8,
    "driver9": 9,
    "driver10": 10,
    "driver11": 11,
    "driver12": 12,
    "driver13": 13,

}

var app = http.createServer();
var io = socketIO(app);

app.listen(socketPort, function () {
    console.log("Fake Server Sockets started at " + socketPort);
});

io.on('connection', function (socket) {
    tracking.run(io,trackNumber[socket.request._query.driver]);
});

module.exports = io;