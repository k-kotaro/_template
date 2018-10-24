var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var plumber = require('gulp-plumber');
var sprite = require('gulp.spritesmith');
var rename = require("gulp-rename");
var sass = require('gulp-sass');
var inlineimage = require('gulp-inline-image');
var imagemin = require('gulp-imagemin');
var imageminPngquant = require('imagemin-pngquant');
var cssmin = require('gulp-cssmin');
var uglify = require('gulp-uglify');
var runSequence = require('run-sequence');
var changed = require('gulp-changed');
var cache = require('gulp-cached');
var watchify = require('watchify');
var comb = require('gulp-csscomb');
var autoprefixer = require('gulp-autoprefixer');
var iconfontCss = require('gulp-iconfont-css');
var iconfont = require('gulp-iconfont');
var ejs = require("gulp-ejs");
var browserSync = require('browser-sync');

var project = '_templates';
var subdomain = true;
var minify = true;
var dir  = {
    root: 'root/',
    html:   'html/',
    css:   'css/',
    img: 'images/',
    js: 'scripts/',
    json: 'json/',
    font: 'fonts/',
    include: 'include/',
    spriteImg: 'sprite/',
    scss:   'scss/',
    dev:   'Templates/dev/'
};

var getFolders = function (dir) {
    return fs.readdirSync(dir)
        .filter(function (file) {
        return fs.statSync(path.join(dir, file)).isDirectory();
    });
}

gulp.task('htmlBuild', function(callback) {
	runSequence('ejs',
				'imagemin',
				'copy',
				'reload',
				callback);
});

gulp.task('cssBuild', function(callback) {
    if(minify == true){
        runSequence(['iconfont', 'sprite'],
                    'sass',
                    ['imagemin', 'cssmin'],
					'copy',
					'reload',
                    callback);
    }else{
        runSequence(['iconfont', 'sprite'],
                    'sass',
                    'imagemin',
					'copy',
					'reload',
                    callback);
    }
});

gulp.task('jsBuild', function(callback) {
    if(minify == true){
        runSequence('jsmin',
					'copy',
					'reload',
                    callback);
    }
});

gulp.task('ejs', function() {
  return gulp.src([dir.root + dir.dev + dir.html + '**/*.ejs', '!' + dir.root + dir.dev + dir.html + '**/-*.ejs'])
	.pipe(ejs())
	.pipe(rename({extname: '.html'}))
	.pipe(gulp.dest(dir.root));
});

gulp.task('iconfont', function(){
    var srcGlob = dir.root + dir.dev + dir.font + '*.svg';
    return gulp.src(srcGlob)
    .pipe(iconfontCss({
        fontName: 'icon',
        path: dir.root + dir.dev + dir.scss + '_temp/_font.scss',
        targetPath: '../' + dir.dev + dir.scss + '_setting/_font.scss',
        fontPath: '../../fonts/'
    }))
    .pipe(iconfont({
        normalize: true,
        fontHeight: 128,
        fontName: 'icon',
        formats: ['woff'],
        appendCodepoints:false
    }))
    .pipe(gulp.dest(dir.root + dir.font));
});

gulp.task('sprite', function() {
    var srcGlob = dir.root + dir.dev + dir.spriteImg;
    return getFolders(srcGlob).forEach(function(folder){
        var spriteData = gulp.src(dir.root + dir.dev + dir.spriteImg + folder + '/*.png')
        .pipe(cache('sprite'))
        .pipe(sprite({
            imgName: 'mod_img_sprite.png',
            imgPath: dir.img + folder + '/' + 'mod_img_sprite.png',
            cssName: '_' + folder + '.scss',
            padding: 10
        }));
        spriteData.img.pipe(gulp.dest(dir.root + dir.dev + dir.img + folder));
		spriteData.css.pipe(gulp.dest(dir.root + dir.dev + dir.scss + '_sprite'));
    });
});

gulp.task('sass', function () {
	var pubDir = (minify == true)? dir.root + dir.dev + dir.css : dir.root + dir.css;
    return gulp.src(dir.root + dir.dev + dir.scss + '**/*.scss')
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(inlineimage())
    .pipe(comb())
    .pipe(autoprefixer({
        browsers: ['last 2 version', 'iOS >= 9', 'Android >= 4.4'],
        cascade: false
    }))
    .pipe(gulp.dest(pubDir));
});

gulp.task('cssmin', function() {
    return gulp.src(dir.root + dir.dev + dir.css + '**/*.css')
    .pipe(changed(dir.root + dir.css))
    .pipe(cssmin())
    .pipe(rename(function(path){
        if(!(path.basename.match('.min'))){
            path.basename += '.min';
            path.extname = '.css';
        }
    }))
    .pipe(gulp.dest(dir.root + dir.css));
});

gulp.task('jsmin', function(){
	var pubDir = (minify == true)? dir.root + dir.dev + dir.js : dir.root + dir.js;
    return gulp.src(dir.root + dir.dev + dir.js + '**/*.js')
	.pipe(plumber())
    .pipe(uglify())
    .pipe(rename(function(path){
        if(!(path.basename.match('.min'))){
            path.basename += '.min';
            path.extname = '.js';
        }
    }))
	.pipe(gulp.dest(pubDir));
});

gulp.task('imagemin', function(){
    var srcGlob = dir.root + dir.dev + dir.img + '/**/*.+(jpg|jpeg|png|gif|svg)';
    var imageminOptions = {
        optimizationLevel: 7
    };

    return gulp.src(srcGlob)
    .pipe(plumber())
    .pipe(imagemin([
        imageminPngquant({
            quality: '65-80',
            speed: 1,
            floyd:0
       })
    ], imageminOptions))
    .pipe(imagemin(imageminOptions))
    .pipe(gulp.dest(dir.root + dir.img));
});

gulp.task('copy', function(callback) {
  	var dstDir = '/xampp/htdocs/' + project;
    //var dstDir = '/Applications/XAMPP/xamppfiles/htdocs/' + project;
    return gulp.src([
        dir.root + '**/*'
    ])
    .pipe(changed(dstDir))
    .pipe(gulp.dest(dstDir));
    callback();
});

gulp.task('browser-sync', function() {
	browserSync.init({
	  	notify: false,
	  	port: 3001,
		server: {
			baseDir: dir.root,
			index: "index.html"
		}
	});
});

gulp.task('reload', function () {
	browserSync.reload();
});

gulp.task('watchify', function(){
    gulp.watch([dir.root + dir.dev + dir.html + '**/*.ejs'], ['htmlBuild']);
    gulp.watch([dir.root + dir.dev + dir.scss + '**/*.scss'], ['cssBuild']);
    gulp.watch([dir.root + dir.dev + dir.js + '**/*.js'], ['jsBuild']);
});

gulp.task('default', ['watchify', 'browser-sync']);
