const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
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
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: './index.html'
    }),
    new HtmlWebPackPlugin({
      template: './src/pages/recover.html',
      filename: './recover/index.html'
    }),
    new HtmlWebPackPlugin({
      template: './src/pages/new-user.html',
      filename: './new-user/index.html'
    }),
    new HtmlWebPackPlugin({
      template: './src/pages/dashboard.html',
      filename: './dashboard/index.html'
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same option in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[id].css'
    })
  ]
};
