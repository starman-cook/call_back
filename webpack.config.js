const path = require("path");
const webpack = require("webpack");
require("dotenv").config({ path: "./.env" });

module.exports = {
  mode: "production",
  // mode: 'development',
  // devtool: 'eval-source-map',
  devtool: "source-map",
  entry: "./src/index.ts",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        include: [path.resolve(__dirname, "src")],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    // publicPath: 'public',
    filename: "call_back.js",
    path: path.resolve(__dirname, "public"),
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.SENTRY_DNS": JSON.stringify(process.env.SENTRY_DNS),
      "process.env.API_URL": JSON.stringify(process.env.API_URL),
    }),
  ],
};
