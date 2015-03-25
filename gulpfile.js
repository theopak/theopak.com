var harp        = require('harp');
var gulp        = require('gulp');
var deploy      = require('gulp-gh-pages');
var cp          = require('child_process');

/**
 * Build the Harp Site
 */
gulp.task('build', function (done) {
  cp.exec('harp compile . dist', {stdio: 'inherit'})
    .on('close', done)
});

/**
 * Push build to gh-pages
 */
gulp.task('deploy', ['build'], function () {
  return gulp.src("./dist/**/*")
    .pipe(deploy())
});
