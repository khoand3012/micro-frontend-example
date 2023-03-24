const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const path = require("path");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const deps = require("./package.json").dependencies;
module.exports = {
  mode: "development",
  entry: "./src/index",

  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
  },

  devtool: "inline-source-map",

  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },

  devServer: {
    port: 3000,
    static: {
      directory: path.join(__dirname, "./dist"),
      publicPath: "/dist",
    },
  },

  module: {
    rules: [
      {
        test: /\.m?js/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(css|s[ac]ss)$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-react"],
        },
      },
      {
        test: /\.json$/,
        loader: "json-loader",
      },
    ],
  },

  plugins: [
    new CleanWebpackPlugin(),
    new ModuleFederationPlugin({
      name: "home",
      filename: "remoteEntry.js",
      remotes: ["header"],
      exposes: {},
      shared: {
        ...deps,
        react: {
          import: "react", // the "react" package will be used a provided and fallback module
          shareKey: "react", // under this name the shared module will be placed in the share scope
          shareScope: "default", // share scope with this name will be used
          singleton: true, // only a single version of the shared module is allowed
        },
        "react-dom": {
          singleton: true, // only a single version of the shared module is allowed
          requiredVersion: deps["react-dom"],
        },
      },
    }),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
    }),
  ],

  optimization: {
    splitChunks: {
      chunks: "all",
      minSize: 0,
      cacheGroups: {
        data: {
          test: /\.json$/,
          filename: "[name].js",
          name(module) {
            const filename = module.rawRequest.replace(/^.*[\\/]/, "");
            return filename.substring(0, filename.lastIndexOf("."));
          },
        },
      },
    },
  },
};
