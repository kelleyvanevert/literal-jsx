module.exports = {
  env: {
    development: {
      presets: [["@babel/env", { modules: "commonjs" }]],
      plugins: ["add-module-exports"],
      ignore: ["**/*.spec.js"],
      exclude: ["node_modules"]
    },
    production: {
      presets: [["@babel/env", { modules: "commonjs" }], "minify"],
      plugins: ["add-module-exports"],
      ignore: ["**/*.spec.js"],
      exclude: ["node_modules"]
    },
    test: {
      presets: [["@babel/env", { modules: "commonjs" }]],
      plugins: ["add-module-exports"],
      exclude: ["node_modules"]
    }
  }
};
