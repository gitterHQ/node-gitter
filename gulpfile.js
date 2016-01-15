var gulp = require('gulp');
var mocha = require('gulp-spawn-mocha');

/**
 * test
 */
gulp.task('test', function() {
  return gulp.src(['./test/**/*.js'], { read: false })
    .pipe(mocha({
      reporter: 'spec',
      timeout: 10000,
      istanbul: {
        dir: 'output/coverage-reports/'
      },
      env: {
        Q_DEBUG: 1
      }
    }));
});

gulp.task('default', ['test']);
