var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var path = require("path");
var port = 3010;
var demoNum = 3;

module.exports = {
  context: path.resolve(__dirname, "example"), // string（绝对路径！）
  devtool: "eval",
  cache: true,
  entry: [
    "react-hot-loader/patch",
    // 开启 React 代码的模块热替换(HMR)
    "webpack-dev-server/client?http://0.0.0.0:" + port,
    "webpack/hot/only-dev-server",
    "./App"+demoNum+".jsx"
  ],
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    // 当模块热替换(HMR)时在浏览器控制台输出对用户更友好的模块名字信息
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: true
      }
    }),
    new HtmlWebpackPlugin({
      title: "Custom template",
      template: "./index"+demoNum+".html", // Load a custom template (ejs by default see the FAQ for details)
      hash: true,
      filename: "./index.html"
    })
  ],
  resolve: {
    modules: ["node_modules", path.resolve(__dirname, "src")],
    extensions: [".js", ".jsx"]
  },
  devServer: {
    hot: true,
    // 开启服务器的模块热替换(HMR)
    host: "0.0.0.0",
    port: port
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        include: __dirname,
        options: {
          presets: [["es2015", { modules: false }], "stage-1", "react"],
          plugins: [
            "react-hot-loader/babel"
            // 开启 React 代码的模块热替换(HMR)
          ]
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
