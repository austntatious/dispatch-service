var gulp = require('gulp');

var config_css = {
  src: './src/app/**/*.css',
  srcVariables: './src/app/styles/appstyle-config.js',
  destDir: './public/css/spa',
  destFileName: 'app.css'
};

gulp.task('css:build', function () {
  var sourcemaps = require('gulp-sourcemaps');

  return gulp
    .src(config_css.src)
    .pipe(require('gulp-plumber')())
    .pipe(sourcemaps.init())
    .pipe(require('gulp-concat')(config_css.destFileName))
    .pipe(
      require('gulp-postcss')([
        require('precss')({ /* options */ }),
        require('postcss-simple-vars')({
          variables: require(config_css.srcVariables)
        })
      ])
    )
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config_css.destDir));
});

gulp.task('css:watch', ['css:build'], function() {
  gulp.watch(config_css.src, ['css:build'])
})
