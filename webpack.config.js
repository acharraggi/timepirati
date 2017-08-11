/*
    ./webpack.config.js
*/
var ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './client/index.html',
  filename: 'index.html',
  inject: 'body'
});

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
      HtmlWebpackPluginConfig]
};
