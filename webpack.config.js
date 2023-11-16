const path = require("path");

module.exports = {
  entry: "./src/HanderDragSacle.js", // 入口文件
  output: {
    // 输出配置
    path: path.resolve(__dirname, "build"),
    filename: "index.js",
    library: "HanderDragSacle",
    libraryTarget: "umd",
  },

  // experiments: {
  //   outputModule: true,
  // },

  // mode: "development",
  mode: "production",
  module: {
    // 模块配置
    // rules: [
    //   {
    //     test: /\.js$/, // 使用babel-loader处理js文件
    //     exclude: /node_modules/,
    //     use: "babel-loader",
    //   },
    // ],
  },

  optimization: {
    // sideEffect: false,
  },
  plugins: [
    // 插件配置
    // 插件配置项
  ],
};
