const webpack = require('webpack');
const path = require('path');
const glob = require('glob');
const UglifyEsPlugin = require('uglify-es-webpack-plugin');

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
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                ['env', {
                                    'modules': false
                                }]
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
        new webpack.SourceMapDevToolPlugin({
            filename: '../../../Templates/dev/sourcemap[name].map',
            append: '\n//# sourceMappingURL=Templates/dev/sourcemap[name].map',
        }),
        //new UglifyEsPlugin(),
    ]

    //devtool: 'source-map',
    /*plugins: [
    ]*/
};