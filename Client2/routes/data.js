var nconf = require('nconf');
var _ = require('underscore');
var Consent = require('../data/models/consent');
var Activation = require('../data/models/activation');
var callback = require('../lib/callback');
var middleware = require('../lib/middleware');

module.exports = function(app) {

    var log = app.set('log');
    var messaging = require('../lib/messaging').init(log);

    app.post('/consent/:code', middleware.verify(),function(req, res) {
        var payload = req.body;
        var code = req.params.code;
        var resultCallback = callback.resultCallback(req, res);

        if (!code)
            return res.send(404);

        if (!req.activation)
            return res.send(403);

        Consent.findOne({ 'activationCode': code }, function(err, doc) {
            if (doc) {
                doc.updated = new Date();
                doc.data = _.extend(doc.data, payload.data);
                doc.meta = payload.meta;
            }
            else {
                doc = new Consent({
                    activationCode: code,
                    data: payload.data,
                    meta: payload.meta
                });
            }

            doc.save(function(err, savedConsent) {
                if (err) {
                    log.err('Consent save failed for ' + code + ' - ' + err);

                    return resultCallback(true, { statusCode: 500 });
                }

                log.debug('Consent save successful for ' + code);
                return resultCallback(false, { statusCode: 201 });
            });

        });

    });

    app.post('/consent/:code/submit', middleware.verify(), function(req, res) {
        var payload = req.body;
        var code = req.params.code;
        var resultCallback = callback.resultCallback(req, res);

        if (!code)
            return res.send(404);

        if (!req.activation)
            return res.send(403);

        Consent.findOne({ 'activationCode': code }, function(err, doc) {
            if (doc) {
                doc.updated = new Date();
                doc.data = _.extend(doc.data, payload);
            }
            else {
                doc = new Consent({
                    activationCode: code,
                    data: payload
                });
            }


            doc.save(function(err, savedConsent) {
                if (err) {
                    log.err('Consent Submit save failed for ' + code + ' - ' + err);

                    return resultCallback(true, { statusCode: 500 });
                }

                Consent.findOne({ 'activationCode': code }, function(err, consent) {

                    if (!consent)
                        return resultCallback(true, { statusCode: 500 });


                    messaging.send(consent, code, function(err) {
                        if (err)
                            return resultCallback(true, { statusCode: 500 });

                        log.debug('Consent submit successful for ' + code);

                        return resultCallback(false, { statusCode: 201 });
                    });
                });


            });



        });


    });
};
