var Shift = require('../models/Shift').model;

function findOrCreateShift(location,status){
    return new Promise(function (resolve, reject) {
        var query = {
            DriverId: location.DriverId
        };

        Shift.findOne(query, function(err,shift){
            if(err){
                return reject(err);
            }
            else if(!shift && !status){
                return reject("Bad Location Object")
            }
            else if(!shift){
                var shiftObj = new Shift({
                    DriverId: location.DriverId,
                    TenantId: location.TenantId,
                    Status: status || 'ONLINE',
                    LastSeenLocation: {
                        type: 'Point',
                        coordinates: [location.Longitude, location.Latitude]
                    },
                    Timestamp: location.Timestamp,
                    BookingId: location.BookingId
                });
                return resolve(shiftObj)
            }
            else{
                resolve(shift);
            }
        });
    });
}

module.exports = {
    findOrCreateShift
}