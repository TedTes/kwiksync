const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const Dotenv = require("dotenv-webpack");
module.exports = (env) => {
  const envPath = env.production ? ".env.production" : ".env.development";
  return {
    entry: "./src/web/index.tsx",
    output: {
      filename: "bundle.js",
      path: path.resolve(__dirname, "dist"),
      assetModuleFilename: "images/[name][ext]",
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js"],
    },

    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "ts-loader",
            options: {
              configFile: path.resolve(__dirname, "tsconfig.frontend.json"),
            },
          },
        },
        {
          test: /\.css$/i,
          use: [
            "style-loader",
            "css-loader",
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: {
                  plugins: [require("tailwindcss"), require("autoprefixer")],
                },
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/web/public/index.html",
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, "src/web/public"),
            to: path.resolve(__dirname, "dist"),
            globOptions: {
              ignore: ["**/index.html"],
            },
          },
        ],
      }),
      new Dotenv({
        path: envPath,
      }),
    ],
    devServer: {
      historyApiFallback: true, // Support client-side routing
      port: 3001,
      devMiddleware: {
        writeToDisk: true, // Write files to disk
      },
    },
  };
};
