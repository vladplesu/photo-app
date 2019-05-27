const webpack = require('webpack');
const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  target: 'web',
  mode: 'development',
  entry: path.join(__dirname, '/src/app/index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  // devServer: {
  //   port: 9000,
  //   contentBase: path.join(__dirname, 'src/public'),
  //   watchContentBase: true,
  //   watchOptions: {
  //     poll: true
  //   }
  // },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        ]
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: { minimize: true }
          }
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader']
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
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same option in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[id].css'
    })
  ]
};
