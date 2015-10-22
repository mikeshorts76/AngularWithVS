var nconf = require('nconf');
var Activation = require('../data/models/activation.js');
var state = require('../data/models/state.js');
var consent = require('../data/models/consent.js');
var middleware = require('../lib/middleware');
var async = require('async');
var pkginfo = require('pkginfo')(module);

var version = module.exports.version;

module.exports = function(app) {

    var log = app.set('log');

    app.get('/', function(req, res) {
        res.render('home',  {
            version: version,
            clientBuild: nconf.get('USE_CLIENT_BUILD')
        });
    });

    app.get('/home', function(req, res) {
        res.render('home',  {
            version: version,
            clientBuild: nconf.get('USE_CLIENT_BUILD')
        });
    });

    app.get('/activation/:code', function(req, res) {
        var code = req.params.code.trim();

        Activation.find({ code: code }, function(err, activations){

            if (activations.length !== 0) {
                req.session.code = code;

                log.info('Login successful for company ' + activations[0].company + ' with code ' + code);

                res.setHeader('code', code);
                return res.redirect(req.headers['referer'] || '/'  + 'consent');
            }

            log.warning('Activation failed with code ' + code);
            res.render('notfound');
        });

    });

    app.post('/', function(req, res) {
        var body = req.body;

        Activation.find({ code: body.activationCode.trim() }, function(err, activations){

            if (activations.length !== 0) {
                req.session.code = body.activationCode.trim();

                log.info('Login successful for company ' + activations[0].company + ' with code ' + body.activationCode.trim());

                res.setHeader('code', body.activationCode.trim());
                return res.redirect(req.headers['referer'] + 'consent');
            }

            log.warning('Activation failed with code ' + body.activationCode.trim());
            res.render('notfound');
        });


    });

    app.get('/consent', middleware.authenticate(), function(req, res) {
        var activation = req.activation;

        if (!activation)
            return res.redirect('/');

        var getToken = function(callback) {
            require('crypto').randomBytes(32, function(ex, buf) {
                var token = buf.toString('hex');

                activation.token = token;
                activation.save(function(err, savedActivation) {

                    if (err) {
                        log.err('Activation token save failed ' + err);
                        callback(false, { token: null });
                    }

                    callback(false, { token: token });
                });
            });

        };

        var getConsent = function(code, callback) {
            consent.findOne({ 'activationCode': code }, function(err, doc) {
                if (err) {
                    log.err('Consent find for code ' + code + ' failed: ' + err);
                    callback(false, { consent: null });
                }

                doc = doc || { data: null };

                callback(false, { consent: doc.data });
            });
        };

        var tasks = [ function (callback) { getConsent(activation.code, callback);},
            function (callback) { getToken(callback); } ] ;

        async.parallel(tasks,
            function(error, parallelResults) {
                var consent = parallelResults[0].consent;
                var token = parallelResults[1].token;

                var data = {
                    version: version,
                    clientBuild: nconf.get('USE_CLIENT_BUILD')
                };

                data.data = JSON.stringify({ code: activation.code, consent: consent, token: token, company: activation.company });
                res.render('wizard', data);

            });


    });
};
