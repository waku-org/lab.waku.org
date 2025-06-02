const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

const isProduction = process.env.NODE_ENV === 'production';
const publicPath = isProduction ? '/dogfooding/' : '/';

module.exports = {
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "index.js",
    publicPath: publicPath,
  },
  experiments: {
    asyncWebAssembly: true,
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  mode: "production",
  devtool: "source-map",
  node: {
    global: false
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "index.html",
      filename: "index.html",
      inject: 'head',
      scriptLoading: 'defer',
      publicPath: publicPath,
      templateParameters: {
        removeScript: true
      }
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "public/style.css", to: "style.css" },
        { from: "manifest.json", to: "manifest.json" },
        { from: "favicon.ico", to: "favicon.ico" },
        { from: "favicon.png", to: "favicon.png" },
      ],
    }),
  ],
};