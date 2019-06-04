var config = require('../../config');
var mongoose = require('mongoose');

var name = "AccessToken";

var schema = new mongoose.Schema({
    UserId: String,
    UserName: String,
    TokenString: String,
    Owner: {},
    Claims: String,
    Created: {
        type: Date,
        default: Date.now
    },
    Expires: {
        type: Date,
        default: function() {
            return new Date(new Date().setSeconds(new Date().getSeconds() + config.security.tokenLife));
        }
    }
});

var model = mongoose.model(name, schema);

module.exports = {
    name: name,
    model: model,
    schema: schema
};