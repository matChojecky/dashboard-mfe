const fs = require("fs");
const path = require("path");
const IgnorePlugin = require('webpack/lib/IgnorePlugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const {
  WebpackManifestPlugin: ManifestPlugin,
} = require("webpack-manifest-plugin");
const postcssNormalize = require("postcss-normalize");
const paths = require("./paths");
// const { AirPolutionWidget } = require("../widget.config");

const isDevelopment = process.env.NODE_ENV === 'development';

const appPackageJson = require(paths.appPackageJson);

const imageInlineSizeLimit = parseInt(
  process.env.IMAGE_INLINE_SIZE_LIMIT || "10000"
);

const getStyleLoaders = (cssOptions, preProcessor) => {
  const loaders = [
    isDevelopment && require.resolve("style-loader"),
    !isDevelopment && {
      loader: MiniCssExtractPlugin.loader,
      // css is located in `static/css`, use '../../' to locate index.html folder
      // in production `paths.publicUrlOrPath` can be a relative path
      options: paths.publicUrlOrPath.startsWith(".")
        ? { publicPath: "../../" }
        : {},
    },
    {
      loader: require.resolve("css-loader"),
      options: cssOptions,
    },
    {
      loader: require.resolve("postcss-loader"),
      options: {
        postcssOptions: {
          ident: "postcss",
          plugins: [
            require("postcss-flexbugs-fixes"),
            require("postcss-preset-env")({
              autoprefixer: {
                flexbox: "no-2009",
              },
              stage: 3,
            }),
            postcssNormalize(),
          ],
        },
        sourceMap: true,
      },
    },
  ].filter(Boolean);
  if (preProcessor) {
    loaders.push(
      {
        loader: require.resolve("resolve-url-loader"),
        options: {
          sourceMap: true,
          root: paths.appSrc,
        },
      },
      {
        loader: require.resolve(preProcessor),
        options: {
          sourceMap: true,
        },
      }
    );
  }
  return loaders;
};

const hasJsxRuntime = (() => {
  if (process.env.DISABLE_NEW_JSX_TRANSFORM === "true") {
    return false;
  }

  try {
    require.resolve("react/jsx-runtime");
    return true;
  } catch (e) {
    return false;
  }
})();

module.exports = {
  mode: isDevelopment ? "development" : "production",
  bail: !isDevelopment,
  devtool: isDevelopment ? "cheap-module-source-map" : "source-map",
  devServer: {
    contentBase: paths.appBuild,
    port: 3001,
  },
  entry: paths.appIndexJs,
  output: {
    path: paths.appBuild,
    pathinfo: isDevelopment,
    filename: isDevelopment
      ? "static/js/[name].[contenthash:8].js"
      : "static/js/[name].js",
    chunkFilename: isDevelopment
      ? "static/js/[name].[contenthash:8].chunk.js"
      : "static/js/[name].chunk.js",
    publicPath: paths.publicUrlOrPath,
    chunkLoadingGlobal: `webpackJsonp__${appPackageJson.name
      .replace("@", "")
      .replace("/", "_")}`,
    globalObject: "this",
    devtoolModuleFilenameTemplate: isDevelopment
      ? (info) => path.resolve(info.absoluteResourcePath).replace(/\\/g, "/")
      : (info) =>
        path
          .relative(paths.appSrc, info.absoluteResourcePath)
          .replace(/\\/g, "/"),
  },
  optimization: {
    minimize: !isDevelopment,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          parse: {
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          keep_classnames: !isDevelopment,
          keep_fnames: !isDevelopment,
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
          },
        },
      }),
    ],
    splitChunks: {
      chunks: "all",
      name: false,
    },
    runtimeChunk: false,
  },
  resolve: {
    extensions: paths.moduleFileExtensions
      .map((ext) => `.${ext}`)
      .filter((ext) => true || !ext.includes("ts")),
    alias: {},

    fallback: {
      module: false,
      dgram: false,
      dns: false,
      fs: false,
      http2: false,
      net: false,
      tls: false,
      child_process: false,
    },
  },

  module: {
    strictExportPresence: true,
    rules: [
      // Disable require.ensure as it's not a standard language feature.
      { parser: { requireEnsure: false } },
      {
        // "oneOf" will traverse all following loaders until one will
        // match the requirements. When no loader matches it will fall
        // back to the "file" loader at the end of the loader list.
        oneOf: [
          {
            test: [/\.avif$/],
            loader: require.resolve("url-loader"),
            options: {
              limit: imageInlineSizeLimit,
              mimetype: "image/avif",
              name: "static/media/[name].[hash:8].[ext]",
            },
          },
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve("url-loader"),
            options: {
              limit: imageInlineSizeLimit,
              name: "static/media/[name].[hash:8].[ext]",
            },
          },
          // Process application JS with Babel.
          // The preset includes JSX, Flow, TypeScript, and some ESnext features.
          {
            test: /\.(js|mjs|jsx|ts|tsx)$/,
            include: paths.appSrc,
            loader: require.resolve("babel-loader"),
            options: {
              customize: require.resolve(
                "babel-preset-react-app/webpack-overrides"
              ),
              presets: [
                [
                  require.resolve("babel-preset-react-app"),
                  {
                    runtime: hasJsxRuntime ? "automatic" : "classic",
                  },
                ],
                "@babel/preset-typescript",
              ],

              plugins: [
                [
                  require.resolve("babel-plugin-named-asset-import"),
                  {
                    loaderMap: {
                      svg: {
                        ReactComponent:
                          "@svgr/webpack?-svgo,+titleProp,+ref![path]",
                      },
                    },
                  },
                ],
              ].filter(Boolean),
              // This is a feature of `babel-loader` for webpack (not Babel itself).
              // It enables caching results in ./node_modules/.cache/babel-loader/
              // directory for faster rebuilds.
              cacheDirectory: true,
              // See #6846 for context on why cacheCompression is disabled
              cacheCompression: false,
              compact: !isDevelopment,
            },
          },
          // Process any JS outside of the app with Babel.
          // Unlike the application JS, we only compile the standard ES features.
          {
            test: /\.(js|mjs)$/,
            exclude: /@babel(?:\/|\\{1,2})runtime/,
            loader: require.resolve("babel-loader"),
            options: {
              babelrc: false,
              configFile: false,
              compact: false,
              presets: [
                [
                  require.resolve("babel-preset-react-app/dependencies"),
                  { helpers: true },
                ],
              ],
              cacheDirectory: true,
              cacheCompression: false,

              // Babel sourcemaps are needed for debugging into node_modules
              // code.  Without the options below, debuggers like VSCode
              // show incorrect code and set breakpoints on the wrong lines.
              sourceMaps: !isDevelopment,
              inputSourceMap: !isDevelopment,
            },
          },

          {
            test: /\.css$/,
            use: getStyleLoaders({
              importLoaders: 1,
              sourceMap: true,
            }),
            sideEffects: true,
          },
          {
            test: /\.(scss|sass)$/,
            use: getStyleLoaders(
              {
                importLoaders: 3,
                sourceMap: true,
              },
              "sass-loader"
            ),
            sideEffects: true,
          },
          // that fall through the other loaders.
          {
            loader: require.resolve("file-loader"),
            // Exclude `js` files to keep "css" loader working as it injects
            // its runtime that would otherwise be processed through "file" loader.
            // Also exclude `html` and `json` extensions so they get processed
            // by webpacks internal loaders.
            exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
            options: {
              name: "static/media/[name].[hash:8].[ext]",
            },
          },
          // ** STOP ** Are you adding a new loader?
          // Make sure to add the new loader(s) before the "file" loader.
        ],
      },
    ],
  },
  plugins: [

    new ModuleFederationPlugin({
      name: AirPolutionWidget.id,
      library: {
        type: 'var',
        name: AirPolutionWidget.id
      },
      filename: "remoteEntry.js",
      remotes: {},
      exposes: {
        "./": "./src/index",
      },
      shared: {},
    }),
    new HtmlWebpackPlugin(
      Object.assign(
        {},
        {
          inject: true,
          template: paths.appHtml,
        },
        !isDevelopment
          ? {
            minify: {
              removeComments: true,
              collapseWhitespace: true,
              removeRedundantAttributes: true,
              useShortDoctype: true,
              removeEmptyAttributes: true,
              removeStyleLinkTypeAttributes: true,
              keepClosingSlash: true,
              minifyJS: true,
              minifyCSS: true,
              minifyURLs: true,
            },
          }
          : undefined
      )
    ),

    !isDevelopment &&
    new MiniCssExtractPlugin({
      filename: "static/css/[name].[contenthash:8].css",
      chunkFilename: "static/css/[name].[contenthash:8].chunk.css",
    }),

    new ManifestPlugin({
      fileName: "asset-manifest.json",
      publicPath: paths.publicUrlOrPath,
      generate: (seed, files, entrypoints) => {
        const manifestFiles = files.reduce((manifest, file) => {
          manifest[file.name] = file.path;
          return manifest;
        }, seed);
        const entrypointFiles = entrypoints.main.filter(
          (fileName) => !fileName.endsWith(".map")
        );

        return {
          files: manifestFiles,
          entrypoints: entrypointFiles,
        };
      },
    }),

    new IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/,
    }),
  ].filter(Boolean),
};
