var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ProgressPlugin = require('progress-bar-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'bundle.js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Examples',
            template: 'src/index.html',
            filename: 'index.html',
            inject: 'body'
        }),
        ProgressPlugin()
    ],
    module: {
        loaders: [
            {
                test: /\.js?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel', // 'babel-loader' is also a legal name to reference
                query: {
                    presets: ['es2015']
                }
            }
        ]
    }
};