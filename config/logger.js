'use strict';

var winston = require('winston');
winston.emitErrs = true;

// TO DO : add mongodb transport to store logs

// when not testing, log everything to console and local file
if (process.env.NODE_ENV !== 'test') {
    var logger = new winston.Logger({
        transports: [
            new winston.transports.File({
                 level: 'info',
                 filename: './logs/app.log',
                 handleExceptions: true,
                 json: false,
                 maxsize: 5242880, //5MB
                 maxFiles: 5,
                 colorize: false
             }),
            new winston.transports.Console({
                level: 'debug',
                handleExceptions: true,
                json: false,
                prettyPrint: true,
                silent: false,
                timestamp: false,
                colorize: true
            })
        ],
        exitOnError: false
    });
} else {
    // don't log anything if testing
    var logger = new winston.Logger({
        transports: [
        ]
    });
}

module.exports = logger;
module.exports.stream = {
    write: function(message){
        logger.info(message);
    }
};
