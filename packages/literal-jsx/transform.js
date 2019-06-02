const config = {
  babelrc: false,
  presets: ["@babel/env"]
};
module.exports = require("babel-jest").createTransformer(config);
