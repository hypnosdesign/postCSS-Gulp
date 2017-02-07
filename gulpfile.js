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
        sass           = require('gulp-sass'),
        maps           = require('gulp-sourcemaps'),
        del            = require('del'),
        babel          = require('gulp-babel'),
        babelrc        = require('babel-register'),
        sync           = require('browser-sync').create(),
        pug            = require('gulp-pug');

// set path variables
const path = {
  src: './src',
  dist: './dist',
  deploy: './deploy'
}

// ****************
//   TASKS:
// *********************

// Javascript TASK

gulp.task('concatenate', () => {
  return gulp.src([
    path.src + '/js/vendor/**/*.js',
    path.src + '/js/main.js'
  ])
  .pipe(maps.init())
  .pipe( concat('app.js') )
  .pipe ( babel({
    "presets": "es2015"
  }) )
  .pipe(maps.write('./'))
  .pipe( gulp.dest(path.dist + '/js') )
});

gulp.task('minify', ['concatenate'], () => {
  return gulp.src([
    path.dist + '/js/app.js'
  ])
  .pipe( uglify() )
  .pipe(rename('app.min.js'))
  .pipe( gulp.dest(path.dist + '/js') )
  .pipe(sync.reload({ stream: true }));
});



// CSS with postCSS TASK
gulp.task('css', ['sass'], () => {
  
  const processor = [
    cssnext, 
    pxtorem({
      propWhiteList: [],
      mediaQuery: true
    }),
    svgFragments,
    cssnano({ 
      autoprefixer: false
    })
  ]

  return gulp.src(path.dist + '/css/app.css')
    .pipe( postcss(processor) )
    .pipe(rename('app.min.css'))
    .pipe( gulp.dest(path.dist + '/css') )
    .pipe(sync.reload({ stream: true }));
});


// SASS TASK
gulp.task('sass',() => {
  return gulp.src(path.src + '/sass/app.scss')
    .pipe(maps.init())
    .pipe( sass())
    .pipe(maps.write('./'))
    .pipe(gulp.dest(path.dist + '/css'))
});


// Static server
gulp.task('sync', function() {
    sync.init({
        server: {
            baseDir: path.dist
        },
        port: 8000,
        browser: "google chrome canary"
    });
});




// WATCH TASK
gulp.task('serve', () => {
  gulp.watch(path.src + '/sass/**/*.scss', ['css']);
  gulp.watch(path.src + '/js/**/*.js', ['minify']);
  gulp.watch(path.src + '/views/**/*.pug', ['html']);
} );





// HTML Tasks


gulp.task('html', ['htmlpug'], () => {
  return gulp.src(path.dist + '/**/*.html')
    .pipe(sync.reload({ stream: true }));
});


// PUG Tasks


gulp.task('htmlpug', () => {
  return gulp.src('src/views/**/*.pug')
    .pipe(pug({
      pretty: true
      }))
    .pipe(gulp.dest(path.dist))
});

gulp.task('default', ['html', 'minify', 'css', 'serve', 'sync']);