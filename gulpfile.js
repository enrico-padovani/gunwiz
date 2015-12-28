var gulp = require('gulp'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    rimraf = require('rimraf'),
    cssnano = require('gulp-cssnano');

var paths = {
    src: './src',
    dist: './dist',
    demo: './demo/assets'
};

gulp.task('clean', function (cb) {
    return rimraf(paths.dist, cb);
});

gulp.task('min:js', function () {
    return gulp.src(paths.src + '/gunwiz.js')
        .pipe(rename(paths.dist  + '/gunwiz.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('.'));
});

gulp.task('min:css', function () {
    return gulp.src(paths.src + '/gunwiz.css')
        .pipe(rename(paths.dist + '/gunwiz.min.css'))
        .pipe(cssnano())
        .pipe(gulp.dest('.'));
});

gulp.task('dist', ['clean', 'min:js', 'min:css'], function () {
    return gulp.src(paths.dist + '/**/*.*')
        .pipe(gulp.dest(paths.demo));
});