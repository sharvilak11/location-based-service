var mongoose = require('mongoose');

var name = 'Location';
var schema = new mongoose.Schema({
    DriverId: {
        type: String,
        required: true
    },
    BookingId: {
        type: String
    },
    TenantId: {
        type: String,
        required: true
    },
    Longitude: {
        type: Number,
        required: true
    },
    Latitude: {
        type: Number,
        required: true
    },
    Timestamp: {
        type: Date,
        required:true
    },
    Speed: {
        type: Number,
        required: true
    },
    Bearing: {
        type: Number,
        required: true
    },
    Accuracy: {
        type: Number,
        required: true
    }
});

var model = mongoose.model(name, schema);
module.exports = {
    name: name,
    model: model,
    schema: schema
};