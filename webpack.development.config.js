const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.config.js');

module.exports = merge(common, {
    plugins: [
        new webpack.SourceMapDevToolPlugin({
            filename: '../../../Templates/dev/sourcemap[name].map',
            append: '\n//# sourceMappingURL=[url]',
        }),
    ]
});