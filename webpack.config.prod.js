var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    index: './src/index'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'static/js/[name].[chunkhash].js',
    chunkFilename: 'static/js/[name].[chunkhash].js',
    publicPath: '/'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new ExtractTextPlugin('static/css/[name].[contenthash].css'),
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      mangle: false,
      output: {
        comments: false
      },
      'support-ie8': true,
      compress: {
        warnings: false
      }
    }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   names: ['vendor', 'manifest']
    // }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html'
    })
  ],
  module: {
    loaders: [
      {
        test: /\.less$/,
        // loader: ExtractTextPlugin.extract({
        //   fallback: "style-loader",
        //   use: "less-loader"
        // })
        loader: ExtractTextPlugin.extract('style', 'css-loader!less-loader')
      },
      {
        test: /\.css$/,
        // loader: ExtractTextPlugin.extract({
        //   fallback: "style-loader",
        //   use: "css-loader"
        // })
        loader: ExtractTextPlugin.extract('style', 'css-loader')
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ['babel-loader']
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: 'static/img/[name].[ext]'
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

