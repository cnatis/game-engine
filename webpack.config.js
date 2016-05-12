var path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.join(__dirname, 'build'),
        library: 'gameEngine'
    },
    resolve: {
        root: path.resolve(__dirname, './src'),
        alias: {
            core: path.resolve(__dirname, './src/core'),
            controls: path.resolve(__dirname, './src/controls'),
            engineUtil: path.resolve(__dirname, './src/util'),
            adapters: path.resolve(__dirname, './src/adapters')
        },
        extensions: ['', '.js']
    },
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