module.exports = {
  env: {
    development: {
      presets: ["@babel/preset-env"],
      plugins: ["add-module-exports"],
      ignore: ["**/*.spec.js"]
    },
    production: {
      presets: ["@babel/preset-env", "minify"],
      plugins: ["add-module-exports"],
      ignore: ["**/*.spec.js"]
    },
    test: {
      presets: ["@babel/preset-env"],
      plugins: ["add-module-exports"]
    }
  }
};
