// Подключение самого Gulp-а
var gulp = require('gulp');

// подключение css и sass плагинов
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var uncss = require('gulp-uncss');

// подключение js плагинов
var concatJs = require('gulp-concat')
var minifyJs = require('gulp-minify')
var uglify = require('gulp-uglify');

// Отдельные плагины
var imagemin = require('gulp-tinypng');

// Task для минифицирования css файлов
gulp.task('minify-css', function() {
  return gulp.src('assets/app/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({browsers: ['last 3 versions']}))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(uncss({html: ['index.html']}))
    .pipe(gulp.dest('assets/dest/styles/'));
});

// Task для минифицирования JavaScript файлов
gulp.task('minify-js', function() {
  return gulp.src('assets/app/**/*.js')
  .pipe(concatJs('scripts.min.js'))
  .pipe(uglify()) 
  .pipe(gulp.dest('assets/dest/scripts/'))
});

// Task для сжатия png файлов без потерь
gulp.task('tinypng', function () {
    gulp.src('assets/app/**/*.png')
        .pipe(imagemin('eKJf273ZwggolXsloo3tDizmOiER9tgr'))
        .pipe(gulp.dest('assets/dest/img/'));
});

// Task для слежки изменений в файлов с последующим их изменением
// в режиме реального времени
gulp.task('watch', ['minify-css', 'minify-js', 'tinypng'], function() {
  gulp.watch('assets/app/**/*.scss', ['minify-css']);
  gulp.watch('assets/app/**/*.js', ['minify-js']);
  gulp.watch('assets/app/**/*.png', ['tinypng']);
});

// Конечная сборка проекта одной командой
gulp.task('default', ['watch']);

