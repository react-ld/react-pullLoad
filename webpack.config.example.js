var path = require("path");
var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  context: path.resolve(__dirname, "example"), // string（绝对路径！）
  devtool: "eval",
  cache: true,
  entry: {
    bundle1: ["babel-polyfill", "./App1.jsx"],
    bundle2: ["babel-polyfill", "./App2.jsx"],
    bundle3: ["babel-polyfill", "./App3.jsx"],
    bundle4: ["babel-polyfill", "./App4.jsx"]
  },
  output: {
    path: path.join(__dirname, "demo/"),
    filename: "[name].js"
  },
  plugins: [
    // new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production")
      }
    }),
    new webpack.NamedModulesPlugin(),
    // 当模块热替换(HMR)时在浏览器控制台输出对用户更友好的模块名字信息
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: true
      }
    })
    // new HtmlWebpackPlugin({ template: 'index.html' })
  ],
  resolve: {
    extensions: [".js", ".jsx"],
    modules: ["node_modules", path.resolve(__dirname, "src")]
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        include: __dirname,
        options: {
          presets: [["es2015", { modules: false }], "stage-1", "react"]
        }
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader",
          { loader: "postcss-loader", options: { config: { path: "./postcss.config.js" } } }
        ]
      },
      {
        test: /\.less/,
        use: [
          "style-loader",
          "css-loader",
          { loader: "postcss-loader", options: { config: { path: "./postcss.config.js" } } },
          "less-loader"
        ]
      },
      {
        test: /\.(gif|jpg|png|woff|svg|eot|ttf)$/,
        use: [{ loader: "file-loader" }]
      }
    ]
  }
};
