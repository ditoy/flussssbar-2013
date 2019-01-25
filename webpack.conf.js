import webpack from "webpack";
import path from "path";

const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

export default {
  module: {
    rules: [
      {
        test: /\.((png)|(eot)|(woff)|(woff2)|(ttf)|(svg)|(gif))(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file-loader?name=/[hash].[ext]"
      },
      {
        test: /\.json$/,
          loader: "json-loader"
      },
      {
        loader: "babel-loader",
        test: /\.js?$/,
        exclude: /sellect/,
        query: {cacheDirectory: true}
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      "fetch": "imports-loader?this=>global!exports?global.fetch!whatwg-fetch"
    }),
    new UglifyJsPlugin()
  ],

  context: path.join(__dirname, "src"),
  entry: {
    app: ["../node_modules/sellect.js/src/sellect", "./js/app"]
  },
  output: {
    path: path.join(__dirname, "dist"),
    publicPath: "/",
    filename: "[name].js"
  },
  externals:  [/^vendor\/.+\.js$/]
};
