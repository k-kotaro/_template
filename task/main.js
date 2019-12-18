const browserSync = require('browser-sync').create() // ローカルサーバー、ブラウザのリロード
//const yaml = require('js-yaml') // yamlをjsに変換
const fs = require('fs') // ファイルシステム

/************************************************v
 my task
************************************************/
const dele = require('./dele') // 自作の削除タスク
const copy = require('./copy') // 自作のコピータスク
const watch = require('./watch') // 自作のwatchタスク
const sass = require('./sass') // 自作のsassタスク
const html = require('./html') // 自作のhtmlタスク

/************************************************
paths
************************************************/

// 使いやすいようにそれぞれのパスを変数に入れ直す
const paths = require('../path.config')

// root path
const dist = paths.dist.root

// css path
const cssDist = paths.dist.css

// img path
const imgDist = paths.dist.img

// js path
const jsSrc = paths.src.js
const jsDist = paths.dist.js

// font path
const fontDist = paths.dist.font


/************************************************
data
************************************************/
// ejsで使用するデータ
//let data = {}
//data = yaml.safeLoad(fs.readFileSync(assetsSrc + '/data/data.yaml', 'utf8'))

/************************************************
tasks
************************************************/

// 各タスク を関数化
//const htmlTask = () => {
//  html(src, dist, data)
//}
//const cssTask = () => {
//  sass(cssSrc, cssDist, isDev)
//}
//const imgTask = () => {
//  copy(imgSrc, imgDist, '/**/*.{jpg,png,gif}')
//}
//const jsonTask = () => {
//  copy(jsonSrc, jsonDist, '/**/*.json')
//}

// 監視して更新されたファイルに関するタスクを走らせる
//const watchTasks = () => {
//  watch(src + '/**/*.{html,ejs}', f => {
//    htmlTask()
//  })
//  watch(cssSrc + '/**/*.scss', f => {
//    cssTask()
//  })
//  watch(imgSrc + '/**/*.{jpg,png,gif}', f => {
//    imgTask()
//  })
//  watch(jsonSrc + '/**/*.json', f => {
//    jsonTask()
//  })
//}

// ローカルサーバーを立ち上げる、該当ファイルが更新されたらブラウザをリロード
const serverTask = () => {
  browserSync.init({
    port: port,
    notify: false,
    //proxy: 'localDir.local'
    server: {
      baseDir: paths.dist.root,
      index: 'index.html'
    }
  })

  browserSync.watch(`${dist}/**/*.html`).on('change', browserSync.reload)
  browserSync.watch(`{${jsDist}/**/*.js, !${jsSrc}/**/*.js}`).on('change', browserSync.reload)
  //browserSync.watch(`${imgDist}/**/*.{png,jpg,gif}`).on('change', bs.reload)
  //browserSync.watch(`${jsonDist}/**/*.json`).on('change', bs.reload)
  browserSync.watch(`${cssDist}/**/*.css`, (e, f) => {
    if (e === 'change') {
      browserSync.reload('*.css')
    }
  })
}

// 古いデータを削除後に各タスクを走らせる
dele(dist, () => {
  // 各タスク
  //htmlTask()
  //cssTask()
  //imgTask()
  //jsonTask()

  //watchTasks()
  serverTask()
})
