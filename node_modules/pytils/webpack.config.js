var webpack = require('webpack');

module.exports = {
  entry: './dist/main.js',
  output: {
    filename: 'pytils.bundle.js'
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false }
    })
  ]
};

