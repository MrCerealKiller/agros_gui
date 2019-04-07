const gulp = require('gulp');
const sass = require('gulp-sass');

// Utilities -------------------------------------------------------------------
gulp.task('sassy', function () {
  return gulp.src('./src/scss/bootstrap.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./src/'));
});

// Watchers --------------------------------------------------------------------
gulp.task('watch:sassy', function () {
  gulp.watch('./src/scss/**/*.scss', gulp.series('sassy'));
});
