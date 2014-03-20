var gulp = require('gulp');
var sass = require('gulp-sass');
var jshint = require('gulp-jshint');
var cordova = require('cordova');

// Lint Task
gulp.task('lint', function() {
    return gulp.src('./www/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});

// Compile SASS
gulp.task('sass', function () {
    gulp.src('./www/scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./www/css'));
});

// Compile with cordova
gulp.task('cordova build', function (cb) {
    cordova.build(cb);
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('./www/js/*.js', ['lint', 'cordova build']);
    gulp.watch('./www/scss/*.scss', ['sass', 'cordova build']);
});

// Build the thing
gulp.task('build', ['lint', 'sass', 'cordova build']);

// Default Task
gulp.task('default', ['build', 'watch']);