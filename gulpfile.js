/*
@todo: 
	** preview directory
		sourcemaps = require('gulp-sourcemaps')
	** clear folders
		del = require('del')
	** .coffee
*/

// Include gulp
var gulp = require('gulp');

// Include plugins
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var path = require('path');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var autoprefixer = require('gulp-autoprefixer');
var cssShorthand = require('gulp-shorthand');
var cleanCSS = require('gulp-clean-css');
var livereload = require('gulp-livereload');
var connect = require('gulp-connect');

//the title and icon that will be used for the Grunt notifications
var notifyInfo = {
	title: 'Gulp',
	icon: path.join(__dirname, 'gulp.png')
};

//error notification settings for plumber
var plumberErrorHandler = { errorHandler: notify.onError({
		title: notifyInfo.title,
		icon: notifyInfo.icon,
		message: "Error: <%= error.message %>"
	})
};

//
// TASKS
// =================

// Lint task
gulp.task('lint', function() {
	return gulp.src('src/js/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('connect', function() {
  connect.server({
    root: 'build',
    livereload: true,
    open: { browser: "Google Chrome"}
  });
});

// Compass tasks
gulp.task('sass', function() {
	return gulp.src(['src/scss/**/*.scss'])
		.pipe(plumber(plumberErrorHandler))
		.pipe(sass())
		.pipe(cssShorthand())
		.pipe(autoprefixer({
            browsers: ['last 10 versions', '> 1%', 'IE 7', 'IE 8', 'IE 9', 'IE 10', 'IE 11'],
            cascade: false
        }))
	    .pipe(gulp.dest('src/css'))
		.pipe(rename({ suffix: '.min' }))
		.pipe(cleanCSS({debug: true}, function(details) {
	        console.log(details.name+ ': ' + details.stats.originalSize);
	        console.log(details.name+ '-min: ' + details.stats.minifiedSize);
	    }))
		.pipe(gulp.dest('build/css'))
		.pipe(connect.reload());
});

gulp.task('publishHtml', function() {
	return gulp.src(['src/**/*.html'])
		.pipe(gulp.dest('build'))
		.pipe(connect.reload());
});


// Watch files for changes
gulp.task('watch', function() {
    gulp.watch('src/js/*.js', ['lint']);
    gulp.watch(['src/scss/**/*.scss'], ['sass']);
    gulp.watch(['src/**/*.html'], ['publishHtml']);
});

// Default task
gulp.task('default', ['lint', 'sass', 'publishHtml', 'watch', 'connect']);