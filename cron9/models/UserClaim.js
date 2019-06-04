var mongoose = require('mongoose');

var name = "UserClaim";

var schema = new mongoose.Schema({
    UserId: String,
    ClaimType: String,
    ClaimValue: String
});

var model = mongoose.model(name, schema);

module.exports = {
    name: name,
    model: model,
    schema: schema
};