const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: './src/index.js',
  mode: 'production',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'build'),
  },
  devServer: {
    port: 8080,
    hot: true,
    proxy: {
      '/api': {
        target: 'http://localhost:9001',
        secure: false,
        changeOrigin: true
      }
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
        template: path.join(__dirname, "public", "index.html"),
      })
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
    },
    {

      test: /\.(png|svg|jpg|jpeg|gif)$/i,
      type: 'asset/resource',

    },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
};