// const CompressionPlugin = require("compression-webpack-plugin");
// const HtmlWebpackPlugin = require("html-webpack-plugin");
// const PreloadWebpackPlugin = require("preload-webpack-plugin");
// const webpack = require("webpack");

module.exports = {
  devServer: {
    https: true,
    proxy: "https://syntech.topwork.asia/"
  },

  configureWebpack: {
    plugins: []
  },

  lintOnSave: undefined
};
