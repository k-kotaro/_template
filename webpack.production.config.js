const webpack = require('webpack');
const UglifyEsPlugin = require('uglify-es-webpack-plugin');
const merge = require('webpack-merge');
const common = require('./webpack.common.config.js');

module.exports = merge(common, {
  plugins: [
    new UglifyEsPlugin(),
  ]
});