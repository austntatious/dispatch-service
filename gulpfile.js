var gulp = require('gulp'),
  mocha = require('gulp-mocha'),
  jshint = require('gulp-jshint'),
  stylish = require('jshint-stylish');

//run mocha test suite
gulp.task('test', function() {
  var error = false;
  gulp.src('./test/*.js')
    .pipe(mocha({reporter: 'spec'}))
    .on('error', function() {
      console.log('Tests failed!');
      error = true;
    })
    .on('end', function() {
      if (error) {
        console.log(error);
      } 
      console.log('Tests succeeded!');
      process.exit(0);
    });
});

//find errors in specific javascript files
gulp.task('jshint', function() {
  gulp.src('./app.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

// watch specified files for changes and rerun tasks
// only rerun UNIT tests
gulp.task('watch', function() {
  gulp.watch(['./app.js', './models/driver.js'], ['test','jshint']);
});


// Automate unit tests
// # set node_env to testing 
// Automate integration tests
// # test model integrations
// # test api integrations
// # test routes integrations
// Automate functional user tests
// # client side testing 
// Add code coverage
// # instanbul
// Ensure that codeship runs all necessary tests
