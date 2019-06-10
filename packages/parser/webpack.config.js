const path = require("path");

module.exports = {
  entry: path.resolve(__dirname + "/src/index.js"),
  devtool: "source-map",
  output: {
    path: path.resolve(__dirname + "/lib"),
    filename: "literal-jsx-parser.js",
    library: "LJSX",
    libraryTarget: "umd",
    globalObject: "this"
  },
  module: {
    rules: [
      {
        test: /\.ne$/,
        use: ["nearley-loader"]
      },
      {
        test: /\.js$/,
        use: ["babel-loader"]
      }
    ]
  },
  resolve: {
    extensions: [".js", ".ne"]
  }
};
