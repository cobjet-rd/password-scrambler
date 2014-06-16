var gulp = require('gulp');
var sass = require('gulp-sass');
var jshint = require('gulp-jshint');
var cordova = require('cordova');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');

var paths = {
    sass: ['./scss/**/*.scss'],
    js: ['./www/js/**/*.js']
};

/**
 * Configuration for bower, the client side package manager
 */
var bowerConf = {
    directory: "/www/bower_components"
};

// Lint Task
gulp.task('lint', function() {
    return gulp.src(paths.js)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});

// Compile SASS
gulp.task('sass', function(done) {
    gulp.src('./scss/ionic.app.scss')
        .pipe(sass({errLogToConsole: true}))
        .pipe(gulp.dest('./www/css/'))
        .pipe(minifyCss({
            keepSpecialComments: 0
        }))
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest('./www/css/'))
        .on('end', done);
});

// Compile with cordova
gulp.task('cordova build', function (cb) {
    cordova.build(cb);
});

gulp.task('watch', function() {
    gulp.watch(paths.sass, ['sass']);
    gulp.watch(paths.js, ['lint'])
});

gulp.task('install', ['git-check'], function() {
    return bower.commands.install([], {}, bowerConf)
        .on('log', function(data) {
            gutil.log('bower', gutil.colors.cyan(data.id), data.message);
        });
});

gulp.task('git-check', function(done) {
    if (!sh.which('git')) {
        console.log(
                '  ' + gutil.colors.red('Git is not installed.'),
            '\n  Git, the version control system, is required to download Ionic.',
            '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
                '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
        );
        process.exit(1);
    }
    done();
});

// Build the thing
gulp.task('build', ['lint', 'sass', 'cordova build']);

// Default Task
gulp.task('default', ['build', 'watch']);
