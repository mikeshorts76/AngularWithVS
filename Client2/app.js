// The App
var express = require('express');
var nconf = require('nconf');
var scribe = require('./lib/scribe');
var mongoose = require('mongoose');
var LogEntries = require('node-logentries');
var bodyParser = express.bodyParser();
var util = require('util');
var env = process.env.NODE_ENV || 'development';
var configFile = util.format('/%s.json', env);

//console.log('starting server with  ssl');
var app = module.exports = express.createServer();

nconf.argv().env().file( {file: __dirname + '/config' + configFile} );

var logentries = nconf.get('logentries');
var log = LogEntries.logger({
  token: logentries.token
});


scribe.init(nconf);

//connect to Mongo when the app initializes
mongoose.connect(nconf.get('MONGO_URL'));

var conditionalBodyParser = function (req, res, next) {
    if (req.path == '/activation' || req.path == '/activation/delete' || req.path == '/activation/consent') {
        next();
    } else {
        bodyParser(req, res, next);
    }
};

var ensureSecure = function (req, res, next) {
    if (env === 'production' ||  env === 'test') {
        if (req.headers['x-forwarded-proto'] !== 'https' &&
            req.headers['x-forwarded-proto'] === 'http') {
            res.redirect('https://' + req.headers.host + req.url);
        }
    }

    return next();
};


app.configure( function() {

//    app.use(function(err, req, res, next){
//        console.error(err.stack);
//        res.send(500, 'Something broke!');
//    });
//


    // Set the view engine
    app.set('view engine', 'jade');
    // Set the directory that contains the views
    app.set('views', __dirname + '/views');
    app.use(express.favicon());
    app.set('view options', { layout: false });

    app.use(ensureSecure);
    app.use(express.cookieParser());
    app.use(conditionalBodyParser);
    app.use(express.methodOverride());
    app.use(express.session({
        secret: 'nuggets10'
    }));

    // Use the router middleware
    app.use(app.router);

    app.use(express['static'](__dirname + "/public", { maxAge: 0}));

    app.set('log', log);

    app.use(function(req, res, next) {
        return res.render('404', {
            title: "404 - Page Not Found"
        }, function(err, page) {
            return res.send(page, 404);
        });
    });

});

require('./routes')(app);


var port = parseInt(process.env.PORT) || nconf.get('PORT');

// Create HTTP server with your app
var http = require('http');

var cron = require('./lib/cron');
cron.init(app);

// Listen to port 8080;
console.log('LISTENING ON PORT ' + port);
app.listen(port);
