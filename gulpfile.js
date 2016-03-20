var gulp=require('gulp');
var less=require('gulp-less');
// var jshint = require('gulp-jshint');
var util=require('gulp-util');
var changed=require('gulp-changed');
var htmlMin=require('gulp-htmlmin');
var uglify=require('gulp-uglify');
var cssMin=require('gulp-cssnano');
var concat=require('gulp-concat');

var browserify=require('browserify');
var reactify=require('reactify');
var source=require('vinyl-source-stream');

var nodemon=require('gulp-nodemon');
var browserSync=require('browser-sync');
var BROWSER_SYNC_RELOAD_DELAY=50;

gulp.task('jsx', function() {
  browserify('./src/jsx/App.jsx')
    .transform(reactify)
    .bundle()
    .pipe(source('App.js'))
    .pipe(gulp.dest('./public/js'));
});

// gulp.task('jshint', function() {
//   gulp.src('./src/js/**/*.js')
//     .pipe(jshint())
//     .pipe(jshint.reporter('default'));
// });

gulp.task('js',function(){
    gulp.src('./src/js/*.js')
      .pipe(uglify())
      .pipe(gulp.dest('./public/js'));
});

gulp.task('less', function () {
  gulp.src('./src/less/*.less')
  	.pipe(changed('./public/css/'))
    .pipe(concat('app.less'))
    .pipe(less().on('error',util.log))
    .pipe(cssMin())
    .pipe(gulp.dest('./public/css/'));
});

gulp.task('html',function(){
	gulp.src('./src/*.html')
	 .pipe(changed('./public/'))
	 .pipe(htmlMin({collapseWhitespace:true}))
	 .pipe(gulp.dest('./public/'));
});

gulp.task('nodemon', function (cb) {
  var called = false;
  return nodemon({

    // nodemon our expressjs server
    script: 'server.js',

    // watch core server file(s) that require server restart on change
    watch: ['server.js']
  })
    .on('start', function onStart() {
      // ensure start only got called once
      if (!called) { cb(); }
      called = true;
    })
    .on('restart', function onRestart() {
      // reload connected browsers after a slight delay
      setTimeout(function reload() {
        browserSync.reload({
          stream: false
        });
      }, BROWSER_SYNC_RELOAD_DELAY);
    });
});

gulp.task('browser-sync', ['nodemon'], function () {
  // for more browser-sync config options: http://www.browsersync.io/docs/options/
  browserSync({
    // informs browser-sync to proxy our expressjs app which would run at the following location
    proxy: 'http://localhost:3000',
    // informs browser-sync to use the following port for the proxied app
    // notice that the default port is 3000, which would clash with our expressjs
    port: 4000,
    files: ["./public/css/*.css","./public/*.html","./public/js/*.js"]
  });
});

gulp.task('default',['less','html','jsx','js','browser-sync'],function(){
  // gulp.watch('./src/jsx/*.jsx',['jsx']);
  gulp.watch('./src/less/*.less',['less']);
  gulp.watch('./src/*.html',['html']);
  gulp.watch('./src/jsx/Results/*.jsx',['jsx']);
  gulp.watch('./src/jsx/*.jsx',['jsx']);
  gulp.watch('./src/js/*.js',['js']);

});