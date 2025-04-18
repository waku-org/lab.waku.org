const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: "./src/index.ts", // Changed from index.js to index.ts
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "index.js",
    publicPath: process.env.NODE_ENV === 'production' ? '/dogfooding/' : '/'
  },
  experiments: {
    asyncWebAssembly: true,
  },
  resolve: {
    extensions: ['.ts', '.js'], // Add .ts to the extensions
  },
  module: {
    rules: [
      {
        test: /\.ts$/, // Add a rule for TypeScript files
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
    new CopyWebpackPlugin({
      patterns: ["favicon.ico", "favicon.png", "manifest.json"],
    }),
    new HtmlWebpackPlugin({
      template: 'index.html',
      base: process.env.NODE_ENV === 'production' ? '/dogfooding/' : '/',
    })
  ],
};