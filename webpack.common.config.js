const webpack = require('webpack');
const path = require('path');
const glob = require('glob');

const entries = {};
glob.sync("./root/Templates/dev/**/entry.js", {
  ignore: './root/Templates/dev/**/_*.js'
}).map(function (file) {
  const regEx = new RegExp(`./root/Templates/dev/scripts`);
  const fileOriginalName = file.replace(regEx, '');
  const key = fileOriginalName.replace('entry.js', 'bundle.js');
  const name = fileOriginalName.replace('entry.js', '');
  entries[key] = file;
});

module.exports = {
  mode: 'production',
  entry: entries,
  output: {
    filename: '../../../scripts' + '[name]'
  },
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
        options: {
          fix: true
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
            loader: 'babel-loader',
            options: {
              presets: [
              [
                "@babel/preset-env"
              ]
        ]
      }
        },
      },
    ]
  },
  //eslint: {
  //    configFile: './.eslintrc'
  //},
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
  ]
};