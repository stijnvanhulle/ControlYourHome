var WebpackStrip        = require('strip-loader');
var webpack             = require("webpack");
var BowerWebpackPlugin  = require('bower-webpack-plugin');
var ExtractTextPlugin   = require("extract-text-webpack-plugin");

module.exports = {
    entry: {
        app:__dirname + '/source/js/app.js'
    },
    output: {
        publicPath: "http://localhost:80/",
        path: __dirname + "/source/build/js",
        filename: '[name].bundle.js'
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
    ],
    resolve: {
        alias: {
            "backbone": "lib/backbone-1.1.0",
            "jquery": "lib/jquery-1.10.2",
            "underscore": "lib/lodash.underscore-2.3.0",
            "jqueryUI": "lib/jquery-ui.min"
        }
    }

};
