let webpack = require('webpack')

module.exports = {
  devtool: 'eval-source-map',
  entry: __dirname + '/app/main.js',
  output: {
    path: __dirname + '/public',
    publicPath: '/',
    filename: 'bundle.js',
  },

  devServer: {
    contentBase: './public',
    historyApiFallback: true,
    inline: true,
    host: 'dev.vote.me',
    // https: true,
    port: 8999,
  },

  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /(\.jsx|\.js)$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ["env"]
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|jpeg|gif)(\?.+)?$/,
        loader: 'url-loader',
        options: {
          limit: 4096,
          name : 'assets/img_[hash].[ext]'
        }
      },
      {
        test: /\.(eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
          name : 'assets/soc_[hash].[ext]'
        }
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader"
      },
      {
        test: /\.less$/,
        loader: "style-loader!css-loader!less-loader"
      }
    ]
  },
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map';
  module.exports.output.path = __dirname + '/dist';
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}