/* eslint-disable */
var webpack = require('webpack');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, './app.ts'),
  devtool: 'eval',
  mode: 'production',
  target: 'node', // in order to ignore built-in modules like path, fs, etc.
  externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist')
  },
  node: {
    __dirname: true
  },
  plugins: [
    new webpack.IgnorePlugin(/\.(css|less)$/)
  ],
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
    plugins: [new TsconfigPathsPlugin()],
    alias: {
      '@application': path.resolve(__dirname + 'src/application'),
      '@core': path.resolve(__dirname + 'src/core'),
      '@infrastructure': path.resolve(__dirname + 'src/infrastructure'),
      '@lib': path.resolve(__dirname + 'lib'),
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  }
};