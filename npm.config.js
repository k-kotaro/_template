const path = require('path')

const NODE_ENV = process.env.NODE_ENV

// ルートからのディレクトリを取得
const rootDir = process.cwd()

// os間のパスの違いを吸収
const pr = str => {
  return path.resolve(str)
}

// 環境変数
const project = '_templates';
const port = 10000;

const paths = {
  src: {
    root: pr(`${rootDir}/root/Templates/dev`),
    css: pr(`${rootDir}/root/Templates/dev/css`),
    scss: pr(`${rootDir}/root/Templates/dev/scss`),
    img: pr(`${rootDir}/root/Templates/dev/images`),
    js: pr(`${rootDir}/root/Templates/dev/scripts`),
    json: pr(`${rootDir}/root/Templates/dev/json`),
    font: pr(`${rootDir}/root/Templates/dev/fonts`),
    include: pr(`${rootDir}/root/Templates/dev/include`),
    spriteImg: pr(`${rootDir}/root/Templates/dev/sprite`),
    sourcemap: pr(`${rootDir}/root/Templates/dev/sourcemap`)
  },
  dist: {
    root: pr(`${rootDir}/root`),
    css: pr(`${rootDir}/root/css`),
    img: pr(`${rootDir}/root/images`),
    js: pr(`${rootDir}/root/scripts`),
    fonts: pr(`${rootDir}/root/fonts`)
  },
  node_env: NODE_ENV
}


module.exports = paths
