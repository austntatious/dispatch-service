'use strict';

var express   = require('express'),
  app         = express(),
  logger      = require('./config/logger'),
  dotenv      = require('dotenv'),
  Sequelize   = require('sequelize'),
  mongoose    = require('mongoose');

// Load env varibles from .env file, API keys and other secrets are configured here
// Default path: .env
dotenv.load({ path: '.env.example' });

// Load http server & socket.io
var server = require('http').Server(app);
var io     = require('socket.io')(server);

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

// Connect to PostgreSQL
var pgConnect = function() {
  logger.profile('connect-to-postgres');
  var pgOptions = {
    logging : logger.info,
    dialect : 'postgres'
  };
  if (process.env.NODE_ENV === 'test' || 'production') {
      pgOptions.logging = false;
    } 
  var pg = new Sequelize(process.env.POSTGRES, pgOptions);
  return pg;
};

var sequelize = pgConnect();

sequelize
  .authenticate()
  .then(function(err) {
    if (err) {
      logger.info('Unable to connect to the database: ', err);
    } else {
      logger.profile('connect-to-postgres');
    }
  });

// Load sequelize models and sync if in development!!
var Driver = require('./app/models/Driver')(sequelize);

// Set run environment variables so sync and drop tables only occur in DEVELOPMENT

// TO DO : add sync to ALL models besides Driver
if (process.env.NODE_ENV === 'production') {
  console.log('this is working');
}
Driver.sync().then(function(){
  logger.info('Models and db tables synced!');
});


// TO DO: add single models index to sync all models at once
exports.sequelize = sequelize;

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

