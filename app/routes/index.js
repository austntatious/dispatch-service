// Entry point for all app routes
// NOTE: right now this file is not being used, but later,
// we can bootstrap all routes from this file
var api 		= require('./api'),
	main		= require('./main'),
	plugins		= require('./plugins'); // remove this

module.exports = {
  api: api,
  plugins: plugins,
  main: main
};
