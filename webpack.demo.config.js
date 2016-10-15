var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require("path");
var dist = './dist';

module.exports = {
    context: path.resolve('demo'),
    entry: [
        'babel-polyfill',
        './App.jsx'
    ],
    output: {
        path: path.resolve(dist),
        filename: '[name].js?[chunkhash]'
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.DefinePlugin({ 
            'process.env': {
                NODE_ENV: JSON.stringify("production")
            }
        }),
        new HtmlWebpackPlugin({ template: 'index.html' })
    ],
    resolve: {
        extensions: ['', '.js', '.jsx'],
        root: path.resolve('./src')
    },

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loaders: [
                    'babel'
                ]
            }, {
                test: /\.less$/,
                loaders: [
                    'style',
                    'css?-minimize',
                    'postcss',
                    'less'
                ]
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader?-minimize!postcss'
            }
        ]
    },

    postcss: function () {
        return [
            require('autoprefixer')({ browsers: ["Android >= 4", "iOS >= 7"]})
        ];
    }
};