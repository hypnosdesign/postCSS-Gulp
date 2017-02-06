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
      rename         = require('gulp-rename');


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
  return gulp.src('./src/*.css')
    .pipe( postcss(processor) )
    .pipe( gulp.dest('./dist') );
});

// Javascript

gulp.task('concatenate', () => {
  gulp.src([
    './src/js/vendor/**/*.js',
    './src/js/main.js'
  ])
  .pipe( concat('app.js') )
  .pipe( gulp.dest('./dist/js') )
});

gulp.task('minify', () => {
  gulp.src([
    './dist/js/app.js'
  ])
  .pipe( uglify() )
  .pipe(rename('app.min.js'))
  .pipe( gulp.dest('./dist/js') )
});


// DEFAULT TASKS
gulp.task('default', () => {
  gulp.watch('./src/*.css', ['css']);
  gulp.watch('./src/**/*.js', ['concatenate', 'minify']);
});

