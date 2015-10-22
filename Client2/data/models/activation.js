var mongoose = require('mongoose');

var activationSchema = mongoose.Schema({
    code: String,
    token: String,
    firstName: String,
    lastName: String,
    email: String,
    company: String,
    created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Activation', activationSchema);