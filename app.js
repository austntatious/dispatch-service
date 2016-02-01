'use strict';

var express   = require('express'),
  app         = express(),
  logger      = require('./config/logger'),
  dotenv      = require('dotenv'),
  migration   = require('./app/data/migration'),
  mongoose    = require('mongoose'),
  models      = require('./app/models'),

// Load http server & socket.io
  server      = require('http').Server(app),
  io          = require('socket.io')(server);
// Load env varibles from .env file, API keys and other secrets are configured here
// Default path: .env.example
// TO DO: change default to .env, but use .env.example as fallback
dotenv.load({ path: '.env.example' });

// Connect to MongoDB
// Mongoose by default sets the auto_reconnect option to true.
// Recommended a 30 second connection timeout because it allows for
// plenty of time in most operating environments.

var connectMongo = function () {
  logger.profile('connect-to-mongodb');
  var options = {
    server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
    replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } }
  };
  mongoose.connect(process.env.MONGODB, options);
};
connectMongo();

mongoose.connection.on('error', logger.error.bind(logger, 'mongoose-connection-error:'));
mongoose.connection.on('open', logger.profile.bind(logger,'connect-to-mongodb'));
mongoose.connection.on('disconnected', connectMongo);

// Initialize postgres connection and knex instance

// Initialize models and bookshelf instance
models.init().then(function() {
// Initalize database migration if necessary and not testing
  migration.init();
});


// To Do : exit postgres connection on error or on failure



// To Do: call these as init functions and chain them together to control async flow
// make sure express server starts and logs last, after all settings and modules bootstrapped

// Essential Express middleware config
require('./config/express').primary(app);

// Bootstrap api route
app.use('/api', require('./app/routes/api'));

// Web app middleware
require('./config/express').web(app); 

// Bootstrap web app routes
app.use('/', require('./app/routes/main'));
app.use('/plugins', require('./app/routes/plugins'));

// Start Express Server
server.listen(app.get('port'), function () {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

// Socket.io connection
io.on('connection', function(socket) {
  socket.emit('greet', { hello: 'Hey there browser!' });
  socket.on('respond', function(data) {
    console.log(data);
  });
  socket.on('disconnect', function () {
    console.log('Socket disconnected');
  });
});

module.exports.main = app;

