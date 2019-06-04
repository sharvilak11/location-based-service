var mongoose = require('mongoose');

var name = 'Shift';
var schema = new mongoose.Schema({
    DriverId: {
        type: String,
        required: true
    },
    TenantId: {
        type: String,
        required: true
    },
    Status: {
        type: String,
        enum: ['ONLINE','OFFLINE','ONBREAK','ONJOB','CLEARING'],
        default: 'ONLINE'
    },
    LastSeenLocation: {
        type: { type: String },
        coordinates: []
    },
    ShiftStartTime: {
        type: Date
    },
    ShiftEndTime: {
        type: Date
    },
    LastJobEndTime: {
        type: Date
    },
    Timestamp: {
        type: Date,
        required:true
    }
});

var model = mongoose.model(name, schema);


module.exports = {
    name: name,
    model: model,
    schema: schema
};