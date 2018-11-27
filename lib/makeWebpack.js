const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const fs = require('fs');
const utils = require('./utils');

// 是否是生产环境
const production = process.env.NODE_ENV === 'production';
// 根目录
const ROOTDIR = process.cwd();
const entry = utils.getEntry(path.resolve(ROOTDIR, 'src/pages/'));
const pages = utils.getPages(path.resolve(ROOTDIR, 'src/pages/'));

/**
 * babel的配置参数，可以写在.babelrc文件里也可以写在这里
 */
let query = {
  presets: ['env', 'stage-0'],
  // plugins: ['transform-decorators-legacy', 'transform-decorators', 'transform-runtime']
  // "transform-object-assign": support ios8 use Object.assign
  plugins: ["transform-object-assign", ["transform-runtime", {
    "helpers": false,
    "polyfill": false,
    "regenerator": true,
    "moduleName": "babel-runtime"
  }]]
}
// 判断.babelrc文件是否存在
let ct = fs.existsSync(path.resolve(ROOTDIR, '.babelrc'))
// 如果.babel文件存在，则babel配置使用外部文件中的配置，需要将里面的query配置置空
if (ct) {
  query = {}
}

/**
 * 个性化配置项
 * @param {Object} options
 * @property {Number} options.mode 表示打包后的文件规范：
 * 0 表示默认，所有文件都放在dist目录中，文件引入时加hash值。
 * 1 表示将文件分类存放，引用文件不加hash值。
 * @property {String} options.outputPath 打包后的输出目录
 * @property {Object} options.spritesConfig sprite配置
 */
const makeWebpack = (options) => {
  let mode = 0
  let outputPath = ''
  if (options) {
    if (options.mode) {
      mode = options.mode
    }
    if (options.outputPath) {
      outputPath = options.outputPath
    }
  }

  /**
   * 雪碧图配置
   */
  let spritesConfig = {
    // 过滤不需要合成雪碧图的图片
    filterBy(image) {
      if (image.url.indexOf('/sprite/') === -1) {
        return Promise.reject();
      }
      return Promise.resolve();
    },
    // spritePath: path.posix.join('assets', 'sprite')
  }
  if (options && options.spritesConfig) {
    spritesConfig = Object.assign(spritesConfig, options.spritesConfig)
  }

  let config = {
    entry: entry,
    output: {
      path: path.resolve(ROOTDIR, 'dist'),
      filename: '[name].js',
    },
    module: {
      rules: [
        {
          test: [/\.ejs$/],
          exclude: /node_modules/,
          use: [{
            loader: 'ejs-loader'
          }]
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          // exclude: /node_modules/,
          options: {
            loaders: {
              'scss': [
                MiniCssExtractPlugin.loader,
                {
                  loader: 'vue-style-loader'
                },
                {
                  loader: 'css-loader',
                  options: {
                    importLoaders: 1,
                  }
                },
                {
                  loader: 'postcss-loader',
                  options: {
                    plugins: () => [
                      require('autoprefixer')
                    ]
                  }
                },
                {
                  loader: 'sass-loader'
                },
              ]
            }
          }
        },
        {
          test: /\.jsx?$/,
          // exclude: /node_modules/,
          loader: 'babel-loader', //使用的加载器名称
          query: query
        },
        {
          test: /\.scss$/,
          exclude: /node_modules/,
          use: [
            production ? MiniCssExtractPlugin.loader : 'style-loader',
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                minimize: true
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => [
                  require('autoprefixer')({
                    remove: false // 不会删除老样式写法
                  }),
                  require("postcss-sprites")(spritesConfig)
                ]
              }
            },
            {
              loader: 'sass-loader'
            },
            // {
            //   loader: 'postcss-loader',
            //   options: {
            //     plugins: () => [
            //       require('autoprefixer'),
            //       require('precss'),
            //       require('postcss-flexbugs-fixes')
            //     ]
            //   }
            // }
          ],
        },
        {
          test: /\.css$/,
          // exclude: /node_modules/,
          use: [
            production ? MiniCssExtractPlugin.loader : 'style-loader',
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                minimize: true
              }
            }
          ],
        },
        {
          test: [/\.gif$/, /\.jpe?g$/, /\.png$/],
          loader: 'url-loader',
          options: {
            name: mode === 0 ? '[name].[ext]?v=[hash:5]' : path.posix.join(outputPath, 'assets/[name].[ext]'),
            limit: 1000, //1000字节以下大小的图片会自动转成base64
          },
        },
        {
          test: [/\.(eot|woff2?|ttf|svg)$/],
          loader: "url-loader",
          options: {
            name: mode === 0 ? '[name].[ext]?v=[hash:5]' : path.posix.join(outputPath, 'assets/font/[name].[ext]'),
            limit: 5000, // fonts file size <= 5KB, use 'base64'; else, output svg file
          }
        }
        // {
        //   test: require.resolve('zepto'),
        //   use: ['exports-loader?window.Zepto', 'script-loader']
        // }
      ]
    },
    optimization: {
      runtimeChunk: {
        name: 'manifest'
      },
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            chunks: "all",
            name: "vendor",
            priority: 10,
            enforce: true
          },
          commons: {
            name: 'commons',
            chunks: 'all',
            minChunks: 2,
            maxInitialRequests: 5,
            minSize: 0
          }
        }
      }
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: mode === 0 ? "[name].css?v=[contenthash:8]" : path.posix.join(outputPath, "css/[name].css")
      }),
      new webpack.BannerPlugin('前端开发'),
      new webpack.DefinePlugin({
        __ENV__: JSON.stringify(process.env.NODE_ENV)
      }),
      new WebpackShellPlugin({
        onBuildStart: ['echo "Starting"'],
        onBuildEnd: ['echo "end"']
      })
    ].concat(pages),
    resolve: {
      extensions: ['.js', '.json'],
      alias: {
        '@': resolve('src')
      }
    },
  }

  config.devtool = !production ? 'cheap-module-source-map' : 'null';
  if (mode === 0) {
    config.output.filename = !production ? '[name].js' : '[name].js?v=[chunkhash:8]';
  } else {
    config.output.filename = path.posix.join(outputPath, "js/[name].js")
  }

  if (!production) {
    config.plugins.push(new webpack.HotModuleReplacementPlugin());
    config.devServer = {
      disableHostCheck: true,
      contentBase: path.resolve(ROOTDIR, 'dist'),//本地服务器所加载的页面所在的目录
      // historyApiFallback: true,//不跳转
      inline: true,//实时刷新
      hot: true,
      port: 8080,
      proxy: {
        '/api/*': {
          target: 'http://localhost:9090/',
          secure: false
        }
      }
    }
  }

  if (options) {
    if (options.output) {
      config.output = Object.assign({}, config.output, options.output)
    }
    if (options.module && options.module.rules) {
      config.module.rules = config.module.rules.concat(options.module.rules)
    }
    if (options.plugins) {
      config.plugins = config.plugins.concat(options.plugins)
    }
    if (options.resolve) {
      if (options.resolve.extensions) {
        config.resolve.extensions = config.resolve.extensions.concat(options.resolve.extensions)
      }
      if (options.resolve.alias) {
        config.resolve.alias = Object.assign({}, config.resolve.alias, options.resolve.alias)
      }
    }
    if (options.devServer) {
      config.devServer = Object.assign({}, config.devServer, options.devServer)
    }
  }

  return config;
}

function resolve(dir) {
  return path.resolve(ROOTDIR, dir)
}

module.exports = makeWebpack;
