const path = require("path");
const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");
module.exports = {
  target: "node",
  entry: "./src/server.ts",
  output: {
    filename: "server-bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    extensions: [".ts", ".js", ".json"],
  },

  externals: [
    nodeExternals(), // Exclude all node_modules and Node.js built-ins
    { "./config/database.ts": "commonjs ./config/database.ts" },
  ],

  module: {
    rules: [
      {
        test: /\.(ts)$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
          options: {
            configFile: path.resolve(__dirname, "tsconfig.backend.json"),
          },
        },
      },
    ],
  },
};
