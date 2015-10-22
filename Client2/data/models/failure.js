var mongoose = require('mongoose');

var failureSchema = mongoose.Schema({
    activationCode: String,
    failedMessage: String,
    created: { type: Date, default: Date.now },
    lastModified: Date,
    count: Number
});

module.exports = mongoose.model('Failure', failureSchema);