var mongoose = require('mongoose');

var stateSchema = mongoose.Schema({
    name: String,
    abbreviation: String
});

module.exports = mongoose.model('State', stateSchema);