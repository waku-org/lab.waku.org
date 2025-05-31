const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

module.exports = {
  entry: "./src/index.ts", // Changed from index.js to index.ts
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "index.js",
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
      patterns: ["index.html", "favicon.ico", "favicon.png", "manifest.json"],
    }),
  ],
};
