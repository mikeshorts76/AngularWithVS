var util = require('util');
var _ = require('underscore');
var Activation = require('../data/models/activation.js');
var nconf = require('nconf');

var secret = nconf.get("MESSAGING_SECRET");

module.exports = function(app) {

    var log = app.set('log');

    app.post('/activation', function(req, res) {
        console.log('POST ACTIVATION started');
        var body = '';
        req.setEncoding( 'utf8' );
        req.on( 'data', function ( data ) {
            body += data;

        } );

        req.on( 'end', function () {

            req.body = body.trim();

            if ( req.body.length > 0 ) {

                console.log('New Activation Iron.Mq POST message ' + body);
                body = JSON.parse(body);

                if (body.secret != secret) {
                    console.log('New Activation ' + body.code + ' POST forbidden due to body SECRET ' + body.secret +  ' not matching SECRET ' + secret);
                    res.writeHead(403, {'Content-Type': 'text/html'});
                    return res.end('post failed');
                }

                var data = _.omit(body, 'secret');

                Activation.update({code: data.code}, data, {upsert: true}, function(err, savedActivation) {
                    if (err) {
                        console.log('New Activation ' + body.code + ' Iron.Mq save failed' + err);

                        res.writeHead(500, {'Content-Type': 'text/html'});
                        res.end('post failed');
                    }

                    console.log('New Activation Iron.Mq Successful ' + body.code);

                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.end('post received');
                });

//                var activation = new Activation(data);
//                activation.save(function(err, savedActivation) {
//                    if (err) {
//                        console.log('New Activation ' + body.code + ' Iron.Mq save failed' + err);
//
//                        res.writeHead(500, {'Content-Type': 'text/html'});
//                        res.end('post failed');
//                    }
//
//                    console.log('New Activation Iron.Mq Successful ' + body.code);
//
//                    res.writeHead(200, {'Content-Type': 'text/html'});
//                    res.end('post received');
//                });
            }



        });
    });

    app.post('/activation/delete', function(req, res) {
        var body = '';
        req.setEncoding( 'utf8' );
        req.on( 'data', function ( data ) {
            body += data;
        } );

        req.on( 'end', function () {
            req.body = body.trim();

            if ( req.body.length > 0 ) {
                log.debug('Delete Activation Iron.Mq POST message ' + body);
                body = JSON.parse(body);

                if (body.secret != secret) {
                    log.err('Delete Activation POST forbidden due to body SECRET ' + body.secret +  ' not matching SECRET ' + secret);
                    res.writeHead(403, {'Content-Type': 'text/html'});
                    return res.end('post failed');
                }

                Activation.remove({ code: body.code }, function(err){

                    if (err) {
                        log.err('Delete Activation Iron.Mq delete failed' + err);

                        res.writeHead(500, {'Content-Type': 'text/html'});
                        res.end('post failed');
                    }

                    Consent.remove( { 'activationCode': code }, function(err) {
                        if (err) {
                            console.log( 'error', 'Consent remove failed for ' + code + ' - ' + err);
                            res.writeHead(500, {'Content-Type': 'text/html'});
                            res.end('post failed');
                        }

                        log.debug('Delete Activation Iron.Mq Successful ' + body.code);
                        res.writeHead(200, {'Content-Type': 'text/html'});
                        res.end('post received');
                    });


                });
            }



        });
    });

}

//headers:
//{ host: 'consent-cs.aws.af.cm',
//    'x-forwarded-for': '23.20.228.23, 127.0.0.1',
//    connection: 'close',
//    'accept-encoding': 'gzip',
//    'content-type': 'text/plain; encoding=utf-8',
//    'iron-message-id': '5844628776721643464',
//    'iron-subscriber-message-id': '5844628776721643464',
//    'iron-subscriber-message-url': 'https://mq-aws-us-east-1.iron.io/1/projects/510df68ed4297923f10021ab/queues/consent/messages/5844628776721643464/subscribers/5844628776721643466',
//    'user-agent': 'IronMQ Pusherd',
//    'x-forwarded-port': '80',
//    'x-forwarded-proto': 'http',
//    'content-length': '1578',
//    'x-real-forwarded-for': '10.0.64.200',
//    'x-varnish': '202861697' },