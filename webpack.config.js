var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: [
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    chunkFilename: '[name].[chunkhash].js',
    publicPath: '/static/'
  },
  debug: true,
  devtool: 'source-map',
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    // new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development')
      }
    })
    // new webpack.optimize.UglifyJsPlugin({
    //   output: {
    //     comments: false  // remove all comments
    //   },
    //   compressor: {
    //     warnings: false
    //   }
    // })
    // new ExtractTextPlugin('static/css/[name].[contenthash].css'),
    // new HtmlWebpackPlugin({
    //   filename: 'index.html',
    //   template: 'index.html'
    // })
  ],
  resolve: {
    extensions: ['.less', '.css', '.js', '.json', '']
  },
  module: {
    loaders: [
      {
        test: /\.less$/,
        loader: 'style-loader!css-loader!less-loader'
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      // {
      //   test: /\.less$/,
      //   // loader: ExtractTextPlugin.extract({
      //   //   fallback: "style-loader",
      //   //   use: "less-loader"
      //   // })
      //   loader: ExtractTextPlugin.extract('style', 'css-loader!less-loader')
      // },
      // {
      //   test: /\.css$/,
      //   // loader: ExtractTextPlugin.extract({
      //   //   fallback: "style-loader",
      //   //   use: "css-loader"
      //   // })
      //   loader: ExtractTextPlugin.extract('style', 'css-loader')
      // },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ['babel-loader']
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: '[name].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: '[name].[hash:7].[ext]'
        }
      }
    ],
    postLoaders: [
      {
        test: /\.js$/,
        loaders: ['es3ify-loader']
      }
    ]
  }
};
