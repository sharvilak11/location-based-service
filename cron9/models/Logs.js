var mongoose = require('mongoose');

var name = "Logs";

var schema = new mongoose.Schema({
    JobId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'Jobs'
    },
    RecordsUpdated: Number,
    Success: {
        type: Boolean
    },
    RunTime: {
        type: Date,
        default: Date.now,
        required: true
    },
    Comments: String,
    CreationDate: {
        type: Date,
        default: Date.now
    },
    ModificationDate: Date
});

var model = mongoose.model(name, schema);

module.exports = {
    name: name,
    model: model,
    schema: schema,
};
