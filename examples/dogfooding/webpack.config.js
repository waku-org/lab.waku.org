const path = require("path");

module.exports = {
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "index.js",
    publicPath: process.env.NODE_ENV === 'production' ? '/dogfooding/' : '/'
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
    new CopyWebpackPlugin({
      patterns: [
        { from: "index.html", to: "index.html" },
        { from: "public/style.css", to: "style.css" },
        { from: "manifest.json", to: "manifest.json" },
        { from: "favicon.ico", to: "favicon.ico" },
        { from: "favicon.png", to: "favicon.png" },
      ],
    }),
    new HtmlWebpackPlugin({
      template: 'index.html',
      base: process.env.NODE_ENV === 'production' ? '/dogfooding/' : '/',
    })
  ],
};