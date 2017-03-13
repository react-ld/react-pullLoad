var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');
var devport = 3002;

module.exports = {
    context: path.resolve('demo'),
    entry: [
        'babel-polyfill',
        './App1.jsx'
    ],
    plugins: [
        new webpack.DefinePlugin({ 
            'process.env': {
                NODE_ENV: JSON.stringify("development")
            }
        }),
        new webpack.NoErrorsPlugin(),
        new HtmlWebpackPlugin({ template: 'index.html' })
    ],
    devServer: {
        inline: true,
        noInfo: true,

        host: '0.0.0.0',
        port: devport
    },
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
                    // 'react-hot',
                    'babel'
                ]
            }, 
            {
                test: /\.less$/,
                loader: 'style-loader!css-loader!postcss-loader!less-loader'
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader!postcss-loader'
            }
        ]
    },

    postcss: function() {
        return [
            require('autoprefixer')({ browsers: ["Android >= 4", "iOS >= 7"] })
        ];
    },

    devtool: 'source-map'
};