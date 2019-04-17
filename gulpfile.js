//- gulpモジュール
const gulp = require('gulp');
const fs = require('fs');
const path = require('path');
const plumber = require('gulp-plumber');
const sprite = require('gulp.spritesmith');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const inlineimage = require('gulp-inline-image');
const imagemin = require('gulp-imagemin');
const pngquant  = require('imagemin-pngquant');
const mozjpeg  = require('imagemin-mozjpeg');
const cssmin = require('gulp-cssmin');
const uglify = require('gulp-uglify');
const comb = require('gulp-csscomb');
const autoprefixer = require('gulp-autoprefixer');
const iconfontCss = require('gulp-iconfont-css');
const iconfont = require('gulp-iconfont');
const ejs = require('gulp-ejs');
const browserSync = require('browser-sync');
const webpackStream = require('webpack-stream');
const webpack = require('webpack');
const cache = require('gulp-cached');

var notify = require("gulp-notify");
var pug = require('gulp-pug');

//- プロジェクト設定
const project = '_templates';
const minify = true;
const webpackConfig = require('./webpack.config');
const dir  = {
    root: 'root/',
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

const getFolders = function (dir) {
    return fs.readdirSync(dir)
        .filter(function (file) {
        return fs.statSync(path.join(dir, file)).isDirectory();
    });
}

//- EJSタスク
gulp.task('ejs', () => {
    return gulp.src([dir.root + dir.dev + '**/*.ejs', '!' + dir.root + dir.dev + '**/-*.ejs'], {
        since: gulp.lastRun('ejs')
    })
    .pipe(ejs())
    .pipe(rename({extname: '.html'}))
    .pipe(gulp.dest(dir.root));
});

//- Pug
gulp.task('pug', () => {
    return gulp.src([dir.root + dir.dev + '**/*.pug', '!' + dir.root + dir.dev + '**/-*.pug'], {
        since: gulp.lastRun('pug')
    })
    .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
    .pipe(pug({
        pretty: true
    }))
    .pipe(gulp.dest(dir.root));
});

//- アイコンフォント作成タスク
gulp.task('iconfont', (done) => {
    return gulp.src(dir.root + dir.dev + dir.font + '*.svg', {
        since: gulp.lastRun('iconfont')
    })
    .pipe(cache('iconfont'))
    .pipe(iconfontCss({
        fontName: 'icon',
        path: dir.root + dir.dev + dir.scss + '_temp/_font.scss',
        targetPath: '../' + dir.dev + dir.scss + '_setting/_font.scss',
        fontPath: '../../fonts/'
    }))
    .pipe(iconfont({
        fontName: 'icon',
        formats: ['woff'],
        appendCodepoints: false
    }));
    done();
});

//- スプライト画像、mixin作成タスク
gulp.task('sprite', (done) => {
    var folders = getFolders(dir.root + dir.dev + dir.spriteImg);
    folders.map(function (folder) {
        var spriteData = gulp.src(dir.root + dir.dev + dir.spriteImg + folder + '/*.png', {
            since: gulp.lastRun('sprite')
        })
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
    done();
});

//- sassファイルコンパイルタスク
gulp.task('sass', () => {
    var pubDir = (minify == true)? dir.root + dir.dev + dir.css : dir.root + dir.css;
    return gulp.src(dir.root + dir.dev + dir.scss + '**/*.scss', {
        since: gulp.lastRun('sass')
    })
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

//- CSS圧縮タスク
gulp.task('cssmin', () => {
    return gulp.src(dir.root + dir.dev + dir.css + '**/*.css', {
        since: gulp.lastRun('cssmin')
    })
    .pipe(cssmin())
    .pipe(rename(function(path){
        if(!(path.basename.match('.min'))){
            path.basename += '.min';
            path.extname = '.css';
        }
    }))
    .pipe(gulp.dest(dir.root + dir.css));
});

//- webpackタスク
gulp.task('bundle', () => {
  var pubDir = (minify == true)? dir.root + dir.dev + dir.js : dir.root + dir.js;
    return webpackStream(webpackConfig, webpack)
    .pipe(plumber())
    .pipe(gulp.dest(pubDir));
});

//- JS圧縮タスク
//gulp.task('jsmin', () => {
//    return gulp.src(dir.root + dir.dev + dir.js + '**/*.js')
//        .pipe(plumber())
//        .pipe(uglify())
//        .pipe(rename(function(path){
//        if(!(path.basename.match('.min'))){
//            path.basename += '.min';
//            path.extname = '.js';
//        }
//    }))
//        .pipe(gulp.dest(dir.root + dir.js));
//});

//- 画像圧縮タスク
gulp.task('imagemin', (done) => {
    return gulp.src(dir.root + dir.dev + dir.img + '/**/*.+(jpg|jpeg|png|gif|svg)', {
        since: gulp.lastRun('imagemin')
    })
    .pipe(imagemin([
        pngquant({
            quality: 85,
        }),
        mozjpeg({
            quality: 85,
        }),
        imagemin.gifsicle(),
        imagemin.jpegtran(),
        imagemin.optipng(),
        imagemin.svgo({
            removeViewBox: false,
        }),
    ]))
    .pipe(imagemin())
    .pipe(gulp.dest(dir.root + dir.img));
    done();
});

//- ファイルコピータスク
gulp.task('copy', (done) => {
    var dstDir = '/xampp/htdocs/' + project;
    //var dstDir = '/Applications/XAMPP/xamppfiles/htdocs/' + project;
    return gulp.src([
        dir.root + '**/*'
    ])
    .pipe(gulp.dest(dstDir));
    done();
});

//- ブラウザ同期表示設定
gulp.task('browser-sync', function() {
    browserSync.init({
        notify: false,
        port: 10000,
        server: {
            baseDir: dir.root,
            index: 'index.html'
        }
    });
});

//- ブラウザリロードタスク
gulp.task('reload', (done) => {
    browserSync.reload()
    done()
});

//- HTMLパブリッシュタスク
gulp.task('htmlBuild', gulp.series(
    //'ejs',
    'pug',
    'imagemin',
    gulp.parallel('copy', 'reload')
)
);

//- CSSパブリッシュタスク
gulp.task('cssBuild', gulp.series(
    gulp.parallel('iconfont', 'sprite'),
    'sass',
    gulp.parallel('imagemin', 'cssmin'),
    gulp.parallel('copy', 'reload')
)
);

//- JSパブリッシュタスク
gulp.task('jsBuild', gulp.series(
    'bundle',
    gulp.parallel('imagemin', 'cssmin'),
    gulp.parallel('copy', 'reload')
)
);

//- 監視タスク
gulp.task('watch', () => {
    //gulp.watch(dir.root + dir.dev + '**/*.ejs', gulp.task('htmlBuild'));
    gulp.watch(dir.root + dir.dev + '**/*.pug', gulp.task('htmlBuild'));
    gulp.watch([dir.root + dir.dev + dir.scss + '**/*.scss', '!' + dir.root + dir.dev + dir.scss + '_setting/_font.scss'], gulp.task('cssBuild'));
    gulp.watch(dir.root + dir.dev + dir.js + '**/*.js', gulp.task('jsBuild'));
});

//- default
gulp.task('default', gulp.parallel('watch', 'browser-sync'));
