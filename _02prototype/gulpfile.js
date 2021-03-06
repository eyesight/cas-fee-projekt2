﻿var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');


gulp.task('sass', function() {
	return gulp.src('scss/style.scss')
		.pipe(sass({outputStyle: 'nested'}).on('error', sass.logError))
		.pipe(gulp.dest('css/'));
});

gulp.task('autoprefixer', function(){
    gulp.src('css/style.css')
        .pipe(autoprefixer({
            browsers: ['last 10 versions'],
            cascade: false,
            remove: false
        }))
        .pipe(gulp.dest('../src/css'))
});


//Watch task
gulp.task('default',function() {
    return gulp.watch('scss/**/*.scss',['sass']);
});
