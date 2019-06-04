var mongoose = require('mongoose');

var name = "UserLogin";

var schema = new mongoose.Schema({
    UserName: String,
    LoginDate: {
        type: Date,
        required: true,
        default: function () {
            return new Date();
        }
    },
    UserIP: String,
    Status: {
        type: String,
        required: true,
        enum: ['SUCCESS', 'FAILED_LOGIN', 'INCORRECT_PASSWORD', 'USER_LOCKED_OUT', 'USER_NOT_REGISTERED', 'EMAIL_UNVERIFIED', 'API_ERROR']
    },
});

var model = mongoose.model(name, schema);

module.exports = {
    name: name,
    model: model,
    schema: schema
};