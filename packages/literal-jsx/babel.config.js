module.exports = {
  env: {
    development: {
      presets: ["@babel/preset-env"]
    },
    production: {
      presets: ["@babel/preset-env", "minify"]
    },
    test: {
      presets: ["@babel/preset-env"]
    }
  }
};
