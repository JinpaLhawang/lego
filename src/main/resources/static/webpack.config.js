var path = require('path');

module.exports = {
  entry: './app.js',
  devtool: 'sourcemaps',
  cache: true,
  debug: true,
  resolve: {
    alias: {
      'stompjs': __dirname + '/node_modules/stompjs/lib/stomp.js',
    }
  },
  output: {
    path: __dirname,
    filename: './built/bundle.js'
  },
  module: {
    loaders: [
      {
        test: path.join(__dirname, '.'),
        exclude: /(node_modules)/,
        loader: 'babel-loader'
      }
    ]
  }
};
