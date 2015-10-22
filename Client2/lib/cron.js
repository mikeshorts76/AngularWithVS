var moment = require('moment');
var nconf = require('nconf');
var ironmq = require('ironmq');
var _ = require('underscore');
var Activation = require('../data/models/activation.js');
var Consent = require('../data/models/consent.js');
var Failure = require('../data/models/failure');
var messaging = require('../lib/messaging');
var log;
var cron;


module.exports.init = function ( app ) {

    cron = nconf.get( "CRON" );
    log = app.set('log');
    cron.DEFAULT_FREQUENCY = cron.DEFAULT_FREQUENCY || 86400;

    // this is where you add items to the cron system
    //TODO: add cron job to clear out old tokens or just a new schema with TTL
    start( {
//        'consent-ttl': {
//            'func': function () {
//
//                var timestamp = moment( new Date() );
//                timestamp = timestamp.subtract( 'days', 14 ).toDate();
//                var timestampString = timestamp.toISOString();
//
//                log.info('removing activations and consents older than ' + timestampString );
//
//                Activation.find( { created: { $lt: timestamp } }, function(err, activations) {
//                    if (err)
//                        return log.err('failed to remove activation older than ' + timestampString );
//
//                    _.each(activations, function(activation) {
//                        activation.remove();
//                        Consent.remove( { 'activationCode': activation.code }, function(err) {
//                            if (err)
//                                log.err('failed to remove consent ' + activation.code + ' older than ' + timestampString );
//                        });
//
//                    });
//
//
//                });
//
//            },
//            'frequency': cron.DEFAULT_FREQUENCY
//        },
        'retry-failed-consents': {
            'func': function () {



                Failure.find({}, function (err, failures){
                    _.each(failures, function(failure){
                        log.info('retrying failed consent for ' + failure.activationCode );
                        Consent.findOne({ 'activationCode': failure.activationCode }, function(err, consent) {
                            if (err)
                                return log.err('retry-failed-consents failed to find consent for ' + activation.code );

                            messaging.send(consent, code, function(err){
                                if(err)
                                    return log.err('retry-failed-consents failed to send message for ' + activation.code );
                            });
                        });
                    });
                });

            },
            'frequency': cron.DEFAULT_FREQUENCY
        }
    } );

};

function start( crons ) {

    for ( var name in crons ) {

        if ( !crons.hasOwnProperty( name ) ) {
            continue;
        }

        var cron = crons[name];
        if ( !cron.frequency || cron.frequency < 60 ) {
            log.err('could not start cron ' + name + ' with frequency ' + cron.frequency );
            continue;
        }

        if ( typeof cron.func != 'function' ) {
            log.err('could not start cron ' + name + ' with func of type ' + (typeof cron.func) );
            continue;
        }

        log.info('starting cron ' + name + ' with an interval of ' + cron.frequency + ' seconds' );

        // run once now, don't wait frequency to run again
        process.nextTick( cron.func );

        // keep running
        setInterval( cron.func, cron.frequency * 1000 );

    }

}

