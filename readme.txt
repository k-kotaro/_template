■基本構造

root/
├css/
│└common/ 共通ディレクトリ。
│
├fonts/　パブリッシュされたフォントアイコンが入ります。
│
├images/
│└common/ 共通ディレクトリ
│
├scripts/
│└common/ 共通ディレクトリ
│
├Templates/
│├dev/ 開発ディレクトリ
││├css/ SASSで出力されたCSSがディレクトリごとパブリッシュされます。※minify前
││├datauri/ base64でCSSに埋め込む画像を格納。埋め込む画像次第ではCSSファイルが大きくなりすぎるので要注意
││├fonts/ フォント化させるSVGファイルを格納
││├html/ 開発用テンプレートエンジンのファイルを格納。現在はEJS（暫定）
││├images/ 切り出した画像はここに配置
││├scripts/ 開発用JS
││├scss/ 開発用SCSSファイル※
││└sprite/ CSSスプライトさせる画像を格納
││
│├_module.html　共通モジュール
│└_list.html　ページリスト
│
├xxxxx/
│└index.html
└index.html



■開発用SCSSファイル
sass用scssファイルの置き方と説明。

_base
ベースファイルディレクトリ。ヘッダフッタなどのテンプレート部分の開発ファイル

_module
モジュールファイルディレクトリ。サイト内共通のモジュールの開発ファイル

_setting
SASS設定ファイルディレクトリ。サイト共通変数やmixin、functionなど
_font.scssはgulpから出力されるアイコンフォント用mixinなので触らないこと

_sprite
CSSスプライト設定ファイルディレクトリ。CSSスプライトで使うmixinファイルがここに出力されます
gulpでパブリッシュされるファイルなので触らないこと

_temp
アイコンフォント設定ファイル。触らない

_unique
ユニークディレクトリ。ディレクトリ、ページ個別のCSSがある場合はここに

common
CSSの基本設定ディレクトリ。
上のユニークで書く必要のあるCSSが出てきた場合は_unique.scssへインクルード



■gulp設定
gulpfile.jsに書いてある各gulpタスクの説明。

-gulp変数
基本以外のgulpを追加したときは一番下に追記
基本変数の説明は下記

-プロジェクト設定
project：値に開発用のディレクトリ名設定。XAMPPのhtdocsに入れるディレクトリ名と同じものをいれること
subdomain：サブドメ環境での開発時はtrue
minify：最小化設定の場合はtrue
dir：各ディレクトリ名を入れる。変更ある場合以外はそのまま

-HTMLパブリッシュタスク
EJSコンパイル→画像最小化→htdocsにコピー→リロード
ファイル名の頭に「-」がついてるファイルはコンパイルされません

-CSSパブリッシュタスク
SVGフォント化、CSSスプライト→SASSコンパイル→画像最小化、CSS最小化

-JSパブリッシュタスク
JS最小化→htdocsにコピー→リロード
JSはよほどのことがない限り最小化すること。最小化しない場合は/scriptsへ直接書く

-SASSタスク
autoprefixerで対象ブラウザの設定ができる

-画像最小化タスク
画像圧縮率の設定などは画像があれたりgulpタスクの遅延につながるのでこのまま

-ファイルコピータスク
XAMPPのhtdocsへコピーされます。Win用とMac用あるのでそれぞれ開発環境によって切り替えること

-browser-syncタスク
portの値は開発中のものとかぶらないように注意



■gulp変数
var fs = require('fs'); →ファイルやディレクトリの操作を行います。
var path = require('path'); →パスの正規化やパスの中からディレクトリ部分・ファイル名の部分だけ取得します。
var gulp = require('gulp'); →基本モジュール。
var plumber = require('gulp-plumber'); →エラーをハンドリングしてプロセスが落ちるのを防ぎます。
var sprite = require('gulp.spritesmith'); →CSSスプライト画像・スプライト用mixinを生成します。
var rename = require("gulp-rename"); →ストリームのファイルパスを変更します。
var sass = require('gulp-sass'); →sassのコンパイルをします。
var inlineimage = require('gulp-inline-image'); →CSSの背景画像をBase64化します。
var imagemin = require('gulp-imagemin'); →画像圧縮してデータを軽量化します。
var imageminPngquant = require('imagemin-pngquant'); →.png画像の軽量化をします。
var cssmin = require('gulp-cssmin'); →CSSを圧縮して軽量化します。
var uglify = require('gulp-uglify'); →JSを圧縮して軽量化します。
var runSequence = require('run-sequence'); →タスクを同期処理で順に実行できます。
var changed = require('gulp-changed'); →変更があったファイルを監視します。
var cache = require('gulp-cached'); →ファイルをメモリにキャッシュし、変更されたファイルだけを対象に処理します。
var watchify = require('watchify'); →特定のファイルが変更されたときに自動的にコンパイルを行うことができます。
var comb = require('gulp-csscomb'); →CSSのプロパティを任意の形に整形します。
var autoprefixer = require('gulp-autoprefixer'); →CSSのベンダープレフィックス自動で付与します。
var iconfontCss = require('gulp-iconfont-css'); →アイコンフォントのscssを生成します。
var iconfont = require('gulp-iconfont'); →アイコンフォントを生成します。
var ejs = require("gulp-ejs"); →ejsファイルをコンパイルします。
var browserSync = require('browser-sync'); →特定ファイルの保存時に自動でブラウザリロードします。