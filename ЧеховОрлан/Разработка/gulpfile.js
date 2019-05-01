var gulp       = require('gulp'), // Подключаем Gulp
	sass         = require('gulp-sass'), //Подключаем Sass пакет,
	browserSync  = require('browser-sync'), // Подключаем Browser Sync
	concat       = require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов)
	uglify       = require('gulp-uglifyjs'), // Подключаем gulp-uglifyjs (для сжатия JS)
	uncss 		 = require('gulp-uncss'), // Подключаем пакет для удаления ненужного CSS
	cleanCSS     = require('gulp-clean-css'), // Подключаем пакет для минификации CSS
	rename       = require('gulp-rename'), // Подключаем библиотеку для переименования файлов
	del          = require('del'), // Подключаем библиотеку для удаления файлов и папок
	imagemin     = require('gulp-imagemin'), // Подключаем библиотеку для работы с изображениями
	pngquant     = require('imagemin-pngquant'), // Подключаем библиотеку для работы с png
	cache        = require('gulp-cache'), // Подключаем библиотеку кеширования
	autoprefixer = require('gulp-autoprefixer');// Подключаем библиотеку для автоматического добавления префиксов

gulp.task('sass', function() { // Создаем таск Sass
	return gulp.src('app/scss/**/*.scss') // Берем источник
		.pipe(sass()) // Преобразуем Sass в CSS посредством gulp-sass
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы
		.pipe(cleanCSS({compatibility: 'ie8'})) // Сжимаем
		.pipe(gulp.dest('app/css')) // Выгружаем результата в папку app/css
		.pipe(browserSync.reload({stream: true})) // Обновляем CSS на странице при изменении
});

gulp.task('browser-sync', function() { // Создаем таск browser-sync
	browserSync({ // Выполняем browserSync
		server: { // Определяем параметры сервера
			baseDir: 'app' // Директория для сервера - app
		},
		notify: false // Отключаем уведомления
	});
});

gulp.task('scripts', function() {
	return gulp.src([ // Берем все необходимые библиотеки
			'app/libs/js/jquery/dist/jquery.min.js', // Берем jQuery
			'app/libs/js/bootstrap.min.js', // Берем Bootstrap
			'app/libs/js/popper.min.js', // Берем Popper
		])
		.pipe(concat('libs.min.js')) // Собираем их в кучу в новом файле libs.min.js
		.pipe(uglify()) // Сжимаем JS файл
		.pipe(gulp.dest('app/js')); // Выгружаем в папку app/js
});

gulp.task('code', function() {
	return gulp.src('app/*.html')
	.pipe(browserSync.reload({ stream: true }))
});

gulp.task('css-libs', function() {
	return gulp.src('app/libs/css/libs.scss') // Выбираем файл для минификации
		.pipe(sass()) // Преобразуем Sass в CSS посредством gulp-sass
		.pipe(cleanCSS({compatibility: 'ie8'})) // Сжимаем
		.pipe(uncss({ html: 'index.html' }))
		.pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
		.pipe(gulp.dest('app/css')); // Выгружаем в папку app/css
});

gulp.task('clean', async function() {
	return del.sync('dest'); // Удаляем папку dest перед сборкой
});

gulp.task('img', function() {
	return gulp.src('app/img/**/*') // Берем все изображения из app
		.pipe(cache(imagemin({ // С кешированием
		// .pipe(imagemin({ // Сжимаем изображения без кеширования
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		}))/**/)
		.pipe(gulp.dest('dest/img')); // Выгружаем на продакшен
});

gulp.task('prebuild', async function() {

	var buildCss = gulp.src([ // Переносим библиотеки в продакшен
		'app/css/main.css',
		'app/css/libs.min.css'
		])
	.pipe(gulp.dest('dest/css'))

	var buildFonts = gulp.src('app/fonts/**/*') // Переносим шрифты в продакшен
	.pipe(gulp.dest('dest/fonts'))

	var buildJs = gulp.src('app/js/**/*') // Переносим скрипты в продакшен
	.pipe(gulp.dest('dest/js'))

	var buildHtml = gulp.src('app/*.html') // Переносим HTML в продакшен
	.pipe(gulp.dest('dest'));

});

// Кешировние фотографии для более быстрой загрузки
gulp.task('clear', function (callback) {
	return cache.clearAll();
})

gulp.task('watch', function() {
	gulp.watch('app/scss/**/*.scss', gulp.parallel('sass')); // Наблюдение за scss файлами
	gulp.watch('app/*.html', gulp.parallel('code')); // Наблюдение за HTML файлами в корне проекта
	gulp.watch(['app/js/common.js', 'app/libs/**/*.js'], gulp.parallel('scripts')); // Наблюдение за главным JS файлом и за библиотеками
});

// Таск Default для Devevelopment разработки
gulp.task('default', gulp.parallel('css-libs', 'sass', 'scripts', 'browser-sync', 'watch'));

// Таск Build для Production разработки
gulp.task('build', gulp.parallel('prebuild', 'clean', 'img', 'sass', 'scripts'));