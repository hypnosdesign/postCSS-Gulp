'use strict';
// Gulp and postcss INIT
const gulp            = require('gulp'),
      postcss         = require('gulp-postcss');


// postcss Plugins
const   cssnext       = require('postcss-cssnext'),
        cssnano       = require('cssnano'),
        pxtorem       = require('postcss-pxtorem'),
        svgFragments  = require('postcss-svg-fragments');

// gulp Plugins
const   concat         = require('gulp-concat'),
        uglify         = require('gulp-uglify'),
        rename         = require('gulp-rename'),
        sass           = require('gulp-sass');


// Tasks

// CSS
gulp.task('css', () => {
  const processor = [
    cssnext, 
    pxtorem({
      propWhiteList: [],
      mediaQuery: true
    }),
    svgFragments,
    cssnano
  ];
  return gulp.src('./dist/css/app.css')
    .pipe( postcss(processor) )
    .pipe( gulp.dest('./dist/css') );
});

gulp.task('sass', () => {
  return gulp.src('./src/sass/app.scss')
    .pipe( sass())
    .pipe(gulp.dest('./dist/css'))
})

// Javascript

gulp.task('concatenate', () => {
  return gulp.src([
    './src/js/vendor/**/*.js',
    './src/js/main.js'
  ])
  .pipe( concat('app.js') )
  .pipe( gulp.dest('./dist/js') )
});

gulp.task('minify', () => {
  return gulp.src([
    './dist/js/app.js'
  ])
  .pipe( uglify() )
  .pipe(rename('app.min.js'))
  .pipe( gulp.dest('./dist/js') )
});


// DEFAULT TASKS
gulp.task('default', () => {
  gulp.watch('./src/sass/**/*.scss', ['sass']);
  gulp.watch('./dist/css/app.css', ['css']);
  gulp.watch('./src/**/*.js', ['concatenate', 'minify']);
});

