var nconf = require('nconf');
var secret = nconf.get('SECRET');
var Activation = require('../data/models/activation.js');

var self = module.exports;

self.authenticate = function() {
    return function authenticate(req, res, next) {
        var code = req.params.code || req.session.code;

        Activation.find({ code: code }, function(err, activations){
            if (err)
                console.log("Authenticate error  " + err);

            if (activations.length > 0)
                req.activation = activations[0];

            next();
        });

    };
};

self.verify = function() {
    return function verify(req, res, next) {
        var token = req.headers["x-authorization"] || req.query.token;

        Activation.find({ token: token }, function(err, activations){
            if (err)
                console.log("Authenticate error  " + err);

            if (activations.length > 0)
                req.activation = activations[0];

            next();
        });

    };
};