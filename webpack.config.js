module.exports = {
  entry: "./src/index.js",
  output: {
    path: __dirname + "/dist",
    publicPath: "/d3-bubblechart/",
    filename: "bundle.js",
  },
  devServer: {
    contentBase: "./dist",
  },
};

