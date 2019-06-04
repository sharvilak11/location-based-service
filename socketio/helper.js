var redisHelpers = require('../redis');
var driverService = require('../services/DriverService');
var shiftService = require('../services/ShiftService');

function initialise(io, socket, client) {

    /**********************************************************************/
    /*********************** DRIVER APP SOCKETS ***************************/
    /**********************************************************************/

    // DriverApp sends DRIVERLOCATION socket
    socket.on('DRIVERLOCATION', function (data) {
        console.log(data);
        // redisHelpers.storeDriver(client, data)
        redisHelpers.storeLocations(client, data);

        var tenant = data.TenantId;
        if (io.sockets.adapter.rooms['LIVE_' + tenant]) {
            driverService.fetchDriverDetails(data).then(function (resultData) {
                io.sockets.in('LIVE_' + tenant).emit('DISPATCHRESPONSE', resultData);
            });
        }

        // send to CustomerApp if already room is created with DriverId
        var key = data.DriverId;
        if (io.sockets.adapter.rooms[key]) {
            console.log(key);
            io.sockets.in(key).emit('LOCATIONRESPONSE', data);
        }

        shiftService.findOrCreateShift(data, data.BookingId ? 'ONJOB' : undefined).then(function(shift){
            shift.save();
        });
    });


    /**********************************************************************/
    /*********************** DISPATCH PAGE SOCKETS ************************/
    /**********************************************************************/

    // Dispatch Page sends Dispatch Request socket
    socket.on('DISPATCHREQUEST', function (query) {
        if (query.key == 'LIVE') {
            socket.join('LIVE_' + query.tenant);
            redisHelpers.getLocationsByTenant(client, query.tenant).then(function (data) {
                var queue = [];
                for (var i = 0; i < data.length; i++) {
                    queue.push(driverService.fetchDriverDetails(data[i]));
                }
                Promise.all(queue).then(function (resultData) {
                    io.sockets.in('LIVE' + query.tenant).emit('DISPATCHRESPONSE', resultData);
                });
            });

            if (io.sockets.adapter.rooms['NORMAL_' + query.tenant]) {
                socket.leave('NORMAL_' + query.tenant);
            }
        }
        else if (query.key == 'NORMAL') {
            socket.join('NORMAL_' + query.tenant);
            redisHelpers.getLocationsByTenant(client, query.tenant).then(function (data) {
                var queue = [];
                for (var i = 0; i < data.length; i++) {
                    queue.push(driverService.fetchDriverDetails(data[i]));
                }
                Promise.all(queue).then(function (resultData) {
                    io.sockets.in('NORMAL_' + query.tenant).emit('DISPATCHRESPONSE', resultData);
                })
            });

            if (io.sockets.adapter.rooms['LIVE_' + query.tenant]) {
                socket.leave('LIVE_' + query.tenant);
            }
        }
    });


    /**********************************************************************/
    /****************** CUSTOMERAPP / TRACKING PAGE SOCKETS ***************/
    /**********************************************************************/

    // CustomerApp or Tracking Page sends Location Request socket
    socket.on('LOCATIONREQUEST', function (driverId) {
        socket.join(driverId);
        redisHelpers.getLatestLocationOfDriver(client, driverId).then(function (response) {
            if (response && response[0])
                socket.emit('LOCATIONRESPONSE', JSON.parse(response[0]));
        })
    });
}

module.exports = {
    initialise: initialise
};


