module.exports = {
  env: {
    development: {
      presets: ["@babel/preset-env"],
      plugins: ["add-module-exports"]
    },
    production: {
      presets: ["@babel/preset-env", "minify"],
      plugins: ["add-module-exports"]
    },
    test: {
      presets: ["@babel/preset-env"],
      plugins: ["add-module-exports"]
    }
  }
};
