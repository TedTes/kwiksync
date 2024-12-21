const path = require("path");
const webpack = require("webpack");

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
  externals: {
    sqlite3: "commonjs sqlite3",
    "sql.js": "commonjs sql.js",
    mssql: "commonjs mssql",
    "react-native-sqlite-storage": "commonjs react-native-sqlite-storage",
  },
  module: {
    rules: [
      {
        test: /\.(ts)$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
          options: { configFile: "tsconfig.backend.json" },
        },
      },
    ],
  },
  plugins: [
    new webpack.IgnorePlugin({
      resourceRegExp:
        /nock|node-gyp|mock-aws-s3|aws-sdk|nw-pre-gyp[\/\\]index\.html/,
    }),
  ],

  //   mode: "production",
};
