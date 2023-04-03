const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

const deps = require("./package.json").dependencies;
module.exports = {
  mode: "development",
  entry: {
    main: "./src/index",
  },

  output: {
    filename: "[name].[chunkhash].js",
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
    new UglifyJsPlugin({
      cache: true,
      parallel: true,
    }),
    new CopyPlugin({
      patterns: [
        {
          from: "src/assets/remote-modules.manifest.json",
          to: path.resolve(__dirname, "dist/assets"),
        },
      ],
    }),
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
      minSize: 15000,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          name(module, chunks, cacheGroupKey) {
            const moduleFileName = module
              .identifier()
              .split(/\/|\\/)
              .reduceRight((item) => item);
            const allChunksNames = chunks
              .map((item) => item.name && item.name.slice(0, 5))
              .filter((item) => !!item)
              .join("~");

            return [cacheGroupKey, allChunksNames, moduleFileName]
              .filter((value) => !!value)
              .join("_");
          },
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
};
