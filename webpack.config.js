const webpack = require('webpack');
const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');

module.exports = {
  target: 'web',
  mode: 'development',
  entry: ['@babel/polyfill', path.join(__dirname, '/src/app/index.js')],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      },
      {
        test: /\.(scss)$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: function() {
                return [require('precss'), require('autoprefixer')];
              }
            }
          },
          {
            loader: 'sass-loader'
          }
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader']
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: { minimize: true }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './src/public/index.html',
      filename: './index.html'
    }),
    new HtmlWebPackPlugin({
      template: './src/public/recover.html',
      filename: './recover/index.html'
    }),
    new HtmlWebPackPlugin({
      template: './src/public/new-user.html',
      filename: './new-user/index.html'
    }),
    new HtmlWebPackPlugin({
      template: './src/public/dashboard.html',
      filename: './dashboard/index.html'
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    })
  ]
};
