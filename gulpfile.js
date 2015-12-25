var gulp = require('gulp');
var mocha = require('gulp-mocha');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

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
      if (!error) {
        console.log('Tests succeeded!');
        process.exit(0);
      }
    });
});

//find errors in specific javascript files
gulp.task('jshint', function() {
  gulp.src('./app.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
})

//watch specified files for changes and rerun tasks
gulp.task('watch', function() {
  gulp.watch(['./app.js', './models/Driver.js'], ['test','jshint']);
});
