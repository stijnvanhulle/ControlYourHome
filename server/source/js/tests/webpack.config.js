var WebpackStrip        = require('strip-loader');
var webpack             = require("webpack");
var BowerWebpackPlugin  = require('bower-webpack-plugin');
var ExtractTextPlugin   = require("extract-text-webpack-plugin");

module.exports = {
    entry: {
        app:__dirname + '/test.js'
    },
    output: {
        publicPath: "http://localhost:80/",
        path: __dirname,
        filename: 'tests.bundle.js'
    },
    module: {
        loaders: [
            /*{
                test: /\.js$/,
                loader: WebpackStrip.loader('debug', 'console.log')
            },*/
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader")
            }
        ]
    },
    plugins: [

    ]
};