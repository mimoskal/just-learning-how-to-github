var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var cssShorthand = require('gulp-shorthand');
var cleanCSS = require('gulp-clean-css');

gulp.task('browser-sync', function() {
  browserSync({
    server: {
       baseDir: "build"
    }
  });
});

gulp.task('bs-reload', function () {
  browserSync.reload();
});

gulp.task('images', function(){
  gulp.src('src/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('build/images/'));
});

gulp.task('styles', function(){
  gulp.src(['src/scss/**/*.scss'])
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(sass())
    .pipe(cssShorthand())
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest('src/css/')) 
    .pipe(rename({suffix: '.min'}))
    .pipe(cleanCSS({debug: true}, function(details) {
        console.log(details.name+ ': ' + details.stats.originalSize);
        console.log(details.name+ '-min: ' + details.stats.minifiedSize);
    }))
    .pipe(gulp.dest('build/css/'))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('scripts', function(){
  return gulp.src('src/scripts/**/*.js')
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('build/scripts/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('build/scripts/'))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('default', ['browser-sync', 'styles'], function(){
  gulp.watch("src/scss/**/*.scss", ['styles']);
  gulp.watch("src/scripts/**/*.js", ['scripts']);
  gulp.watch("*.html", ['bs-reload']);
});