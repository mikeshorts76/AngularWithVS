"use strict";

// the actual handle to the instance of winston's custom logger
var scribe = null;

// the general winston library handle
var winston = require( 'winston' );

var util = require( 'util' );

// a lookup table of valid log levels
var logLevels = {};

// if logging is done before scribe is initialized, those logs are queued until init
var queue = [];
var queueSizeLimit = 100;

// clamps an err value ->Error()->String, to ensure it can be text logged easily
function exceptionToMessage( err ) {

    // clamping
    if ( !(err instanceof Error) ) {
        err = {
            message: err,
            stack:   false
        };
    }

    // build message
    var message = "UNCAUGHT_EXCEPTION: " + JSON.stringify( err.message );
    if ( err.stack ) {
        message += " STACK:" + JSON.stringify( err.stack );
    }

    return message;
}

// dummy initial log function (replaced in init)
module.exports.log = function ( level, message, meta ) {

    if ( queue.length >= queueSizeLimit ) {
        console.error( 'Cannot log any more until scribe is initialized. Discarded: ', arguments );
    }
    else {
        queue.push( arguments );
    }

};

function purgeQueue( scribe ) {
    for ( var i = 0; i < queue.length; i++ ) {
        scribe.log.apply( scribe, queue[i] );
    }
    queue = null; // don't store that stuff
}

// get a scribe config formatted for express's logging middle-ware
module.exports.expressLoggerConfig = function () {
    return {
        format: ':remote-addr - - [:date] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"',
        stream: { // fake stream
            write: function ( str ) {
                scribe.log( 'web_access', str );
            }
        }
    };
};

function _getStackTrace( clampFunc ) {
    var obj = {};
    Error.captureStackTrace( obj, clampFunc || module.exports.log );
    return obj.stack;
}

// initialize logging
module.exports.init = function ( config ) {

    var options = {},
        iLevel = 0,
        level = null,
        levelName = null,
        loadedLoggingTransports = 0, // count the number of transports we are using
        transport = null,
        transportType = null,
        scribeConfig = config.get( 'SCRIBE' );

    // see if custom levels passed
    if ( scribeConfig.levels && scribeConfig.levels.length > 0 ) {

        // build the levels option field
        options.levels = {};
        for ( iLevel = 0; iLevel < scribeConfig.levels.length; iLevel++ ) {

            // cache
            level = scribeConfig.levels[iLevel];

            // if there is no level name, or if the name is duplicate, skip this entry
            if ( !level.name || options.levels[level.name] ) {
                continue;
            }

            // create the level numeric index lookup
            options.levels[level.name] = iLevel;

            // if custom color, store it in a custom level colors field
            if ( level.color ) {
                if ( !options.levelColors ) {
                    options.levelColors = {};
                }
                options.levelColors[level.name] = level.color;
            }
        }
    }

    scribe = new (winston.Logger)( options );

    // make lookup table for use when logging, so we don't try to log on non-existent levels
    if ( options.levels ) {
        logLevels = {};
        for ( levelName in options.levels ) {
            if ( !options.levels.hasOwnProperty( levelName ) ) {
                continue;
            }
            logLevels[levelName] = true;
        }
    }
    else {
        logLevels = {
            info:    true,
            warning: true,
            error:   true
        };
    }

    // we had custom colors, set them
    if ( options.levelColors ) {
        winston.addColors( options.levelColors );
    }

    // load each transport from configs
    for ( var j = 0; j < scribeConfig.transports.length; j++ ) {

        // cache
        transport = scribeConfig.transports[j];

        // clamping
        if ( !transport.options ) {
            transport.options = {};
        }

        // transport type specific scribeConfig
        transportType = null;
        switch ( transport.type ) {
            case "file":
                if ( !transport.options.filename ) {
                    continue;
                }
                transportType = winston.transports.File;
                break;
            case "console":
                transportType = winston.transports.Console;
                break;
            default:
                continue;
        }

        // we remove the default transport (if it exists)
        try {
            scribe.clear( transportType );
        }
        catch ( e ) {
            // NO-OP
        }

        // add the transport
        scribe.add( transportType, transport.options );

        // var maintenance
        loadedLoggingTransports++;
    }

    // not enough transports
    if ( loadedLoggingTransports < 1 ) {
        throw ("FATAL: No logging transports defined, its bad to log nothing.");
    }

    // initialize the actual logging function
    module.exports.log = function ( level, message, meta ) {

        // avoid logging loop with nested uncaught exception errors
        try {
            if ( logLevels && logLevels[level] ) {

                // arguments shouldn't be modified
                var args = arguments;

                if ( args[0] === 'error' ) {
                    args[1] = {
                        message: args[1],
                        stack:   _getStackTrace()
                    };
                }

                if ( typeof args[1] !== 'string' ) {
                    args[1] = util.inspect( args[1], false, 20, true );
                }

                scribe.log.apply( scribe, args );
            }
            else {
                console.error( 'Logging attempt with invalid level: ' + level, message, meta );
            }
        }
        catch ( err ) {
            try {
                console.error( 'UNCAUGHT EXCEPTION WHILE LOGGING:', exceptionToMessage( err ) );
            }
            catch ( errIgnore ) {
                // umm, this is awkward-an exception within an exception-I guess we just
                // ignore this and hope something else catches it elsewhere.
            }
        }

    };

    // finally, logging for all uncaught exceptions
    process.on( 'uncaughtException', function ( err ) {

        // log message
        module.exports.log( 'error', exceptionToMessage( err ) );

    } );

    // if any log entries were recorded before initialization, replay those now
    purgeQueue( this );

    // replace the scribe configuration with an instance of scribe
    config.set( 'SCRIBE', this );

    return this;
};