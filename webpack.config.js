/*
    ./webpack.config.js
*/
//TODO: I think this is now redundant, but keeping until I'm sure the dev/prod setup is stable.
var ExtractTextPlugin = require('extract-text-webpack-plugin')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './client/index.html',
  filename: 'index.html',
  inject: 'body'
})
var S3Plugin = require('webpack-s3-plugin')

module.exports = {
  entry: './client/index.js',
  output: {
    path: path.resolve('dist'),
    filename: 'index_bundle.js'
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ },
      /**     { test: /\.css$/, loader: "style-loader!css-loader"} **/
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('css-loader?modules=true&localIdentName=[name]__[local]___[hash:base64:5]')
      }
    ]
  },
  plugins: [new ExtractTextPlugin('styles.css'),
    HtmlWebpackPluginConfig,
    new S3Plugin({
      include: /.*\.(css|js|html)/,
      s3Options: {
      //   accessKeyId: 'key-need to change this to use ENV or a credentials file',
      //   secretAccessKey: 'secret'
      },
      s3UploadOptions: {
        Bucket: 'timepirati.mikesilversides.com'
      }
      // optionally, upload to a sub-folder
      // basePath: '/'
    })
  ]
}
