var mongoose = require('mongoose');

var name = 'Booking';
var schema = new mongoose.Schema({
    BookingId: {
        type: String,
        required: true
    },
    TenantId: {
        type: String,
        required: true
    },
    DriverId: {
        type: String,
        required: true
    },
    StartDateTime: {
        type: Date,
        default: Date.now()
    },
    EndDateTime: {
        type: Date
    },
    Polyline: {
        type: String
    }
});

var model = mongoose.model(name, schema);
module.exports = {
    name: name,
    model: model,
    schema: schema
};