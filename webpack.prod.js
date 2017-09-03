const merge = require('webpack-merge')
// const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const common = require('./webpack.common.js')
var S3Plugin = require('webpack-s3-plugin')
module.exports = merge(common, {
  plugins: [
    // new UglifyJSPlugin()
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
})
