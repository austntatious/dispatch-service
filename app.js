'use strict';

var express   = require('express'),
  app         = express(),
  logger      = require('./config/logger'),
  dotenv      = require('dotenv'),
  mongoose    = require('mongoose');

// Load env varibles from .env file, API keys and other secrets are configured here
// Default path: .env
dotenv.load({ path: '.env' });

// Load http server & socket.io
var server = require('http').Server(app);
var io     = require('socket.io')(server);

// Connect to MongoDB
// Mongoose by default sets the auto_reconnect option to true.
// Recommended a 30 second connection timeout because it allows for
// plenty of time in most operating environments.

var connect = function () {
  logger.profile('connect-to-mongodb');
  var options = {
    server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
    replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } }
  };
  mongoose.connect(process.env.MONGODB, options);
};
connect();

mongoose.connection.on('error', logger.error.bind(logger, 'mongoose-connection-error:'));
mongoose.connection.on('open', logger.profile.bind(logger,'connect-to-mongodb'));
mongoose.connection.on('disconnected', connect);

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

module.exports = app;
