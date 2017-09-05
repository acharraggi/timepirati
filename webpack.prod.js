const merge = require('webpack-merge')
// const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const common = require('./webpack.common.js')
var S3Plugin = require('webpack-s3-plugin')
module.exports = merge(common, {
  plugins: [
    // new UglifyJSPlugin()
    new S3Plugin({
      include: /.*\.(css|js|html|png|ico|svg|json|xml)/,
      s3Options: {
        //   accessKeyId: 'stored in .aws/credentials',
        //   secretAccessKey: 'secret'
      },
      s3UploadOptions: {
        Bucket: 'timepirati.mikesilversides.com'
      },
      // optionally, upload to a sub-folder
      // basePath: '/'
      cloudfrontInvalidateOptions: {
        DistributionId: 'E1CW0GNIEYRCWH',
        Items: ['/*']
      }
    })
  ]
})
