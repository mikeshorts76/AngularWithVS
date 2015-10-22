var ironmq = require('ironmq');
var nconf = require('nconf');
var _ = require('underscore');
var Consent = require('../data/models/consent');
var Activation = require('../data/models/activation');
var Failure = require('../data/models/failure');
var jwt = require('jwt-simple');
var moment = require('moment');

var projectId = nconf.get('IRON_MQ_PROJECT_ID');
var token = nconf.get('IRON_MQ_TOKEN');
var hostUrl = nconf.get('IRON_MQ_HOST');
var secret = nconf.get("MESSAGING_SECRET");
var encryptionSecret = nconf.get('ENCRYPTION_SECRET');

var self = module.exports;

self.init = function(log) {
    self.log = log;

    return self;
};

//https://test.choicescreening.com/message/consent
self.send = function(consent, code, callback) {

    var data = _.extend(consent._doc, { token: secret });
    data.data.Confirm.submittedDate = moment(data.data.Confirm.submittedTimeStamp).format('MM/DD/YYYY h:mm:ss A');

    var message = jwt.encode(data, encryptionSecret);

    ironmq(token, { host: hostUrl })
        .projects(projectId)
        .queues('consents')
        .put(message
        , function callBack(err) {
            if (err) {
                console.log('IronMq put failed for ' + code + ' - ' + err);
                //add to internal queue to try again?
                //TODO: update consent and mark it failed in mongo
                var failure = new Failure({
                    activationCode: code,
                    failedMessage: err,
                    count: 1
                });

                failure.save(function(err, savedFailure) {
                    console.log('Failure save failed for ' + code + ' - ' + err);
                });

                return callback(true);
            }

            Activation.remove( { 'code': code }, function(err) {
                if (err)
                    console.log( 'error', 'Activation remove failed for ' + code + ' - ' + err);

//                Consent.remove( { 'activationCode': code }, function(err) {
//                    if (err)
//                        console.log( 'error', 'Consent remove failed for ' + code + ' - ' + err);
//                });
            });

            return callback(false);
        });

}
