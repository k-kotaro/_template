■基本構造

root/
├css/
│└common/ 共通ディレクトリ。パブリッシュされたCSSが格納されます
│
├fonts/　フォント化されたアイコンが入ります
│
├images/
│└common/ 共通ディレクトリ。パブリッシュされた画像が格納されます
│
├scripts/
│└common/ 共通ディレクトリ。パブリッシュされたJSが格納されます
│
├Templates/
│├dev/ 開発ディレクトリ
││├css/ SASSで出力されたCSSがディレクトリごとパブリッシュされます。※minify前
││├datauri/ base64でCSSに埋め込む画像を格納。埋め込む画像次第ではCSSファイルが大きくなりすぎるので要注意
││├fonts/ フォント化させるSVGファイルを格納
││├images/ 切り出した画像はここに配置
││├scripts/ 開発用JS
││├scss/ 開発用SCSSファイル※
││├sprite/ CSSスプライトさせる画像を格納
││└index.ejs  開発用テンプレートエンジン(EJS)のファイル。
││
│├_module.html　共通モジュール
│└_list.html　ページリスト
│
├xxxxx/
│└index.html　パブリッシュされたHTML
└index.html    パブリッシュされたHTML



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

-gulpモジュール
基本以外のgulpモジュールを追加するときは一番下に追記。
それぞれの説明は下記

-プロジェクト設定
project：値に開発用のディレクトリ名設定。XAMPPのhtdocsに入れるディレクトリ名と同じものをいれること
subdomain：サブドメ環境での開発時はtrue
minify：最小化設定の場合はtrue
dir：各ディレクトリ名を入れる。変更ある場合以外はそのまま

-EJSタスク
EJSコンパイルタスク。ファイル名の頭に「-」がついてるファイルはコンパイルされない

-アイコンフォント作成タスク
SVGで書き出されたアイコンをフォント化する。出力される形式は「.woff」
出力形式は閲覧環境によって変えること（出力できる形式：['ttf', 'eot', 'woff', 'svg']）

-スプライト画像、mixin作成タスク
スプライト用の画像を1つにまとめ、スプライト用のmixinファイルも作成
ディレクトリごとにスプライト画像をまとめられる

-SASSタスク
SASSファイルのコンパイル。背景画像のbase64埋め込み、整形、接頭辞付与も同時に行う
autoprefixerで対象ブラウザを設定することでそれに合わせた接頭辞付与ができる（→ブラウザの設定については、https://github.com/browserslist/browserslist#queries）

-CSS圧縮タスク
CSSをminify化し、ファイル名に.minを付与してCSSディレクトリにパブリッシュ

-webpackタスク
JSをwebpackでバンドル化、JSディレクトリにパブリッシュ

-画像圧縮タスク
画像圧縮率の設定などは画像があれたりgulpタスクの遅延につながるのでこのまま

-ファイルコピータスク
XAMPPのhtdocsへコピーされます。Win用とMac用あるのでそれぞれ開発環境によって切り替えること

-ブラウザ同期表示設定
portの値は開発中のものとかぶらないように注意
ssiやphpは使えないので使う場合はserverの代わりにproxyの方を使う。xampp側にもバーチャルドメイン設定する必要があるので注意

-HTMLパブリッシュタスク
EJSコンパイル→画像最小化→htdocsにコピー→リロード

-CSSパブリッシュタスク
SVGフォント化、CSSスプライト→SASSコンパイル→画像最小化、CSS最小化→htdocsにコピー→リロード

-JSパブリッシュタスク
JS最小化→htdocsにコピー→リロード
JSはよほどのことがない限り最小化すること。最小化しない場合は/scriptsへ直接書く



■gulpモジュール
各基本モジュールの説明。

const gulp = require('gulp'); →基本モジュール。
const fs = require('fs'); →ファイルやディレクトリの操作を行います。
const path = require('path'); →パスの正規化やパスの中からディレクトリ部分・ファイル名の部分だけ取得します。
const plumber = require('gulp-plumber'); →エラーをハンドリングしてプロセスが落ちるのを防ぎます。
const sprite = require('gulp.spritesmith'); →CSSスプライト画像・スプライト用mixinを生成します。
const rename = require("gulp-rename"); →ストリームのファイルパスを変更します。
const sass = require('gulp-sass'); →sassのコンパイルをします。
const inlineimage = require('gulp-inline-image'); →CSSの背景画像をBase64化します。
const imagemin = require('gulp-imagemin'); →画像圧縮してデータを軽量化します。
const pngquant = require('imagemin-pngquant'); →.png画像の軽量化をします。
const mozjpeg  = require('imagemin-mozjpeg'); →.jpg画像の軽量化をします。
const cssmin = require('gulp-cssmin'); →CSSを圧縮して軽量化します。
const comb = require('gulp-csscomb'); →CSSのプロパティを任意の形に整形します。
const autoprefixer = require('gulp-autoprefixer'); →CSSのベンダープレフィックス自動で付与します。
const iconfontCss = require('gulp-iconfont-css'); →アイコンフォントのscssを生成します。
const iconfont = require('gulp-iconfont'); →アイコンフォントを生成します。
const ejs = require("gulp-ejs"); →ejsファイルをコンパイルします。
const browserSync = require('browser-sync'); →特定ファイルの保存時に自動でブラウザリロードします。
const webpackStream = require('webpack-stream'); →webpackを実行します。
const webpack = require('webpack'); →webpackの基本モジュール