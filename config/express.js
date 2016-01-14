'use strict';

// Load module dependencies.
var express     = require('express'), 
  cookieParser  = require('cookie-parser'),   
  compress      = require('compression'),   
  favicon       = require('serve-favicon'),
  session       = require('express-session'),
  bodyParser    = require('body-parser'),
  logger        = require('morgan'),
  errorHandler  = require('errorhandler'),
  lusca         = require('lusca'),
  methodOverride = require('method-override'),
  MongoStore    = require('connect-mongo')(session),
  flash         = require('express-flash'),
  path          = require('path'),
  passport      = require('passport'),
  expressValidator = require('express-validator'),
  sass          = require('node-sass-middleware'),
  morgan        = require('morgan'),
  logger        = require('./logger'),
  helmet        = require('helmet');

// TO DO : Add environment variables to config -- testing, staging, production

// Config for all routes
exports.primary = function(app) {
  app.set('port', process.env.PORT || 3000);
  app.use(compress());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(expressValidator());

  // error handling in dev env
  if (process.env.NODE === 'development') {
    app.use(errorHandler());
  }

  // Override Express logger with morgan logger
  app.use(morgan('short',{ 'stream': logger.stream }));
  //To DO : turn off logger when running test suite
};

// Config for web app routes
exports.web = function(app) {

  // Middleware for static assets in public directory
  app.use(favicon(__dirname + '/../app/public/favicon.png'));
  app.use(express.static(__dirname + '/../app/public', { maxAge: 31557600000 }));
  app.set('views', __dirname + '/../app/views');
  app.set('view engine', 'jade');
  app.use(sass({
    src: (__dirname + '/../app/public'),
    dest: (__dirname + '/../app/public'),
    debug: true,
    outputStyle: 'expanded'
  }));

  // Session management and security 
  app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    store: new MongoStore({ url: process.env.MONGODB, autoReconnect: true })
  }));
  app.use(helmet());
  app.use(methodOverride());
  app.use(cookieParser());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());
  app.use(lusca({
    csrf: true,
    xframe: 'SAMEORIGIN',
    xssProtection: true
  }));


  // other middleware functions
  app.use(function(req, res, next) {
    res.locals.user = req.user;
    next();
  });
  //regex pattern for testing case-insensitive, and redirect to original url after authentication
  app.use(function(req, res, next) {
    if (/plugins/i.test(req.path)) { 
      req.session.returnTo = req.path;
    }
    next();
  });
};
