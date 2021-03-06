// Entry point for all app routes

module.exports = function(app) {
  app.use('/', require('./main'));
  app.use('/api', require('./api'));
  app.use('/plugins', require('./plugins'));
}
