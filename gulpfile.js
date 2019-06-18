//- gulpモジュール
const gulp = require('gulp');
const fs = require('fs');
const path = require('path');
const plumber = require('gulp-plumber');
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
  const json = JSON.parse(fs.readFileSync(dir.root + dir.dev + 'include/meta.json', 'utf-8'));
  return gulp.src([dir.root + dir.dev + '**/*.ejs', '!' + dir.root + dir.dev + '**/-*.ejs'], {
    since: gulp.lastRun(ejsCompile)
  })
    .pipe(ejs({json:json}, {}, {ext: '.html'}))
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
        removeMetadata: false,
        removeUnknownsAndDefaults: false,
        convertShapeToPath: false,
        collapseGroups: false,
        cleanupIDs: false,
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
  const folders = getFolders(dir.root + dir.dev + dir.spriteImg);
  folders.map(function (folder) {
    const spriteData = gulp.src(dir.root + dir.dev + dir.spriteImg + folder + '/*.png')
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
  return gulp.src( dir.root + dir.dev + dir.scss + '**/*.scss', {sourcemaps: true})
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS())
    .pipe(inlineimage())
    .pipe(autoprefixer())
    .pipe(gulp.dest(dir.root + dir.css, {sourcemaps: '../' + dir.dev + dir.sourcemap}));
}

//- 本番用sassファイルコンパイルタスク
const productionSassCompile = () => {
  return gulp.src( dir.root + dir.dev + dir.scss + '**/*.scss')
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS())
    .pipe(inlineimage())
    .pipe(autoprefixer())
    .pipe(gulp.dest(dir.root + dir.css));
}

//- webpackタスク
const bundle = () => {
  const webpackConfig = require('./webpack.development.config');
  return webpackStream(webpackConfig, webpack).on('error', function (e) {
    this.emit('end');
  })
    .pipe(gulp.dest(dir.root + dir.dev + dir.js));
}

//- 本番用webpackタスク
const productionBundle = () => {
  const webpackConfig = require('./webpack.production.config');
  return webpackStream(webpackConfig, webpack).on('error', function (e) {
    this.emit('end');
  })
    .pipe(gulp.dest(dir.root + dir.dev + dir.js));
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
  const dstDir = '/xampp/htdocs/' + project;
  //var dstDir = '/Applications/XAMPP/xamppfiles/htdocs/' + project;
  return gulp.src([dir.root + '**/*'])
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
  browserSync.reload();
  done();
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

//- 本番ファイル書き出しタスク
const productionBuild = gulp.parallel(productionBundle, productionSassCompile);

//- 監視タスク
const watchFiles = () => {
  gulp.watch([dir.root + dir.dev + '**/*.ejs', dir.root + dir.dev + 'include/meta.json'], htmlBuild);
  gulp.watch([dir.root + dir.dev + dir.scss + '**/*.scss', '!' + dir.root + dir.dev + dir.scss + '_setting/_font.scss', '!' + dir.root + dir.dev + dir.scss + '_sprite/*.scss'], cssBuild);
  gulp.watch(dir.root + dir.dev + dir.font + '*.svg', icoBuild);
  gulp.watch(dir.root + dir.dev + dir.js + '**/*.js', jsBuild);
}

//- default
const build = gulp.parallel(watchFiles, browser);

exports.default = build;
exports.productionBuild = productionBuild;