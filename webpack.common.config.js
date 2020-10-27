const webpack = require('webpack');
const glob = require('glob');

const entries = {};
glob.sync("./htdocs/Templates/dev/**/entry.js", {
  ignore: './htdocs/Templates/dev/**/_*.js'
}).map(function (file) {
  const regEx = new RegExp(`./htdocs/Templates/dev/scripts`);
  const fileOriginalName = file.replace(regEx, '');
  const key = fileOriginalName.replace('entry.js', 'bundle.js');
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
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                "@babel/preset-env"
              ]
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
  ]
};
