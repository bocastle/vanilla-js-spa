const path = require('path');

module.exports = {
  entry: './public/js/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist/js'),
    clean: false, // dist/js만 정리, 다른 파일은 유지
  },
  mode: 'production',
  optimization: {
    minimize: true,
  },
  resolve: {
    extensions: ['.js'],
  },
};

