var os = require('os');
var nconf = require('nconf');
var async = require('async');

var Activation = require('../data/models/activation.js');

module.exports = function(app)  {

    app.get('/status', function(req, res) {
        var packageInfo = require(__dirname + '/../package.json');

        getDependenciesStatus(function(status){
            res.send({
                name: packageInfo.name,
                version: packageInfo.version,
                buildMeta: packageInfo.buildMeta,
                nodeVersion: process.version.node,
                process: {
                    pid: process.pid,
                    memory: process.memoryUsage(),
                    uptime: process.uptime()
                },
                os: {
                    memory: os.freemem() + ' / ' + os.totalmem() + ' (free/total)',
                    uptime: os.uptime(),
                    hostname: os.hostname(),
                    cpus: os.cpus().length
                },

                dependencies: {
                    mongostatus: status.mongoStatus
                }
            });
        });

    });

    var getDependenciesStatus = function getDependenciesStatus(resultCallback) {
        var tasks = [ function (callback) {  getMongoStatus(callback); } ];
        async.parallel(tasks,
            function(error, parallelResults) {
                resultCallback({ mongoStatus: parallelResults[0], whittakerStatus: parallelResults[1] });
            });
    };

    var getMongoStatus = function getMongoStatus(callback) {
        var mongoTimeout = setTimeout(function () {
            console.log('mongo timeout');
            return callback(true, { status: 'red', message: 'mongo timeout' })

        }, 2000);

        try {
            var saveDoc = function() {
                Activation.update({code: 'status'}, { code: 'status' }, {upsert: true}, function(err, savedResult) {
                    clearTimeout(mongoTimeout);
                    if (err)
                        callback(true, { status: 'red', message: err });
                    else
                        callback(false, { status: 'green' });
                });
            };
            saveDoc();
        }
        catch(err)
        {
            callback(true, { status: 'red', message: err });
        }
    };


};
