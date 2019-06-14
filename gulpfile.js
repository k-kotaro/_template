//- gulpモジュール
const gulp = require('gulp');
const fs = require('fs');
const path = require('path');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const del = require('del');
const changed = require('gulp-changed');
const ejs = require('gulp-ejs');
const htmlhint = require("gulp-htmlhint");
const iconfont = require('gulp-iconfont');
const iconfontCss = require('gulp-iconfont-css');
const sprite = require('gulp.spritesmith');
const sass = require('gulp-sass');
const inlineimage = require('gulp-inline-image');
const imagemin = require('gulp-imagemin');
const pngquant  = require('imagemin-pngquant');
const mozjpeg  = require('imagemin-mozjpeg');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const browserSync = require('browser-sync');


//- プロジェクト設定
const project = '_templates';
const mode = 'development';  // production or development
const webpackConfig = require('./webpack.' + mode + '.config');
const dir  = {
    root: 'root/',
    css: 'css/',
    img: 'images/',
    js: 'scripts/',
    json: 'json/',
    font: 'fonts/',
    include: 'include/',
    spriteImg: 'sprite/',
    scss: 'scss/',
    sourcemap: 'sourcemap/',
    dev: 'Templates/dev/'
};

const getFolders = (dir) => {
    return fs.readdirSync(dir)
        .filter(function (file) {
        return fs.statSync(path.join(dir, file)).isDirectory();
    });
}

//- EJSタスク
const ejsCompile = () => {
    var json = JSON.parse(fs.readFileSync(dir.root + dir.dev + 'include/meta.json', 'utf-8'));
    return gulp.src([dir.root + dir.dev + '**/*.ejs', '!' + dir.root + dir.dev + '**/-*.ejs'], {
        since: gulp.lastRun(ejsCompile)
    })
    .pipe(ejs({json:json}))
    .pipe(rename({extname: '.html'}))
    .pipe(gulp.dest(dir.root));
}

// HTML Lint
const htmlLint = () => {
    return gulp.src(dir.root + '**/*.html')
    .pipe(htmlhint())
    .pipe(htmlhint.reporter())
}

//- アイコンフォント作成タスク
const iconfontCompile = () => {
    return gulp.src(dir.root + dir.dev + dir.font + '*.svg')
    .pipe(imagemin([
        imagemin.svgo({
            removeViewBox: false,
        }),
    ]))
    .pipe(imagemin())
    .pipe(iconfontCss({
        fontName: 'icon',
        path: dir.root + dir.dev + dir.scss + '_temp/_font.scss',
        targetPath: '../' + dir.dev + dir.scss + '_setting/_font.scss',
        fontPath: '../../fonts/'
    }))
    .pipe(iconfont({
        fontName: 'icon',
        formats: ['woff'],
        prependUnicode: true,
        normalize: true,
        fontHeight: 1000,
    }))
    .pipe(gulp.dest(dir.root + dir.font));
}

//- スプライト画像、mixin作成タスク
const spriteImage = (done) => {
    var folders = getFolders(dir.root + dir.dev + dir.spriteImg);
    folders.map(function (folder) {
        var spriteData = gulp.src(dir.root + dir.dev + dir.spriteImg + folder + '/*.png')
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
}

//- sassファイルコンパイルタスク
const sassCompile = () => {
    const pubMode = (mode == 'production') ? false : true;
    return gulp.src( dir.root + dir.dev + dir.scss + '**/*.scss', {sourcemaps: pubMode})
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS())
    .pipe(inlineimage())
    .pipe(autoprefixer())
    //.pipe(gulp.dest((mode == 'production') ? dir.root + dir.css : dir.root + dir.css, {sourcemaps: '../' + dir.dev + dir.sourcemap}));
    .pipe(gulp.dest(dir.root + dir.css, {sourcemaps: '../' + dir.dev + dir.sourcemap}));
}

//- webpackタスク
const bundle = () => {
  var pubDir = dir.root + dir.dev + dir.js;
    return webpackStream(webpackConfig, webpack)
    .pipe(plumber())
    .pipe(gulp.dest(pubDir));
}

//- 画像圧縮タスク
const imageminify = (done) => {
    return gulp.src(dir.root + dir.dev + dir.img + '/**/*.+(jpg|jpeg|png|gif|svg)')
    .pipe(changed(dir.root + dir.img))
    .pipe(imagemin([
        imagemin.jpegtran({
            quality: 65-80,
        }),
        pngquant({
            quality: [.7, .85],
        }),
        imagemin.gifsicle(),
        imagemin.optipng(),
        imagemin.svgo(),
    ]))
    .pipe(imagemin())
    .pipe(gulp.dest(dir.root + dir.img));
    done();
}

//- ファイルコピータスク
const copy = (done) => {
    var dstDir = '/xampp/htdocs/' + project;
    //var dstDir = '/Applications/XAMPP/xamppfiles/htdocs/' + project;
    return gulp.src([
        dir.root + '**/*'
    ])
    .pipe(gulp.dest(dstDir));
    done();
}

//- ブラウザ同期表示設定
const browser = () => {
    browserSync.init({
        notify: false,
        port: 10000,
        //proxy: 'localDir.local'
        server: {
            baseDir: dir.root,
            index: 'index.html'
        }
    });
}

//- ブラウザリロードタスク
const reload = (done) => {
    browserSync.reload()
    done()
}

//- HTMLパブリッシュタスク
const htmlBuild = gulp.series(
    gulp.parallel(ejsCompile, imageminify),
    htmlLint,
    copy,
    reload
);

//- CSSパブリッシュタスク
const cssBuild = gulp.series(
    gulp.parallel(spriteImage),
    gulp.parallel(sassCompile, imageminify),
    copy,
    reload
);

//- アイコンフォント作成タスク
const icoBuild = gulp.series(
    iconfontCompile
);

//- JSパブリッシュタスク
const jsBuild = gulp.series(
    bundle,
    copy,
    reload
);

//- 監視タスク
const watchFiles = () => {
    gulp.watch([dir.root + dir.dev + '**/*.ejs', dir.root + dir.dev + 'include/meta.json'], htmlBuild);
    gulp.watch([dir.root + dir.dev + dir.scss + '**/*.scss', '!' + dir.root + dir.dev + dir.scss + '_setting/_font.scss', '!' + dir.root + dir.dev + dir.scss + '_sprite/*.scss'], cssBuild);
    gulp.watch(dir.root + dir.dev + dir.font + '*.svg', icoBuild);
    gulp.watch(dir.root + dir.dev + dir.js + '**/*.js', jsBuild);
}

//- default
//const build = gulp.parallel(watchFiles, browser);
const build = watchFiles;

exports.default = build;