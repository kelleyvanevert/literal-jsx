const path = require("path");
const reactHotReloadPlugin = require("craco-plugin-react-hot-reload");

module.exports = {
  webpack: {
    alias: {
      "~": path.resolve(__dirname) + "/src/",
      "react-dom": "@hot-loader/react-dom"
    },
    configure(webpackConfig, { env, paths }) {
      webpackConfig.module.rules.push({
        test: /\.mjs$/,
        type: "javascript/auto"
      });
      return webpackConfig;
    }
  },
  plugins: [
    {
      plugin: reactHotReloadPlugin
    }
  ]
};
