var gulp = require('gulp');
var mocha = require('gulp-mocha');

gulp.task('test', function() {
  var error = false;
  gulp
    .src('./test/*.js')
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

gulp.task('watch', function() {
  gulp.watch(['./app.js', './models/Driver.js'], ['test']);
});
