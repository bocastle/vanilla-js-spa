const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

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
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            pure_funcs: ['console.log', 'console.debug', 'console.warn'],
          },
        },
      }),
    ],
  },
  resolve: {
    extensions: ['.js'],
  },
};

