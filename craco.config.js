const path = require("path");
const reactHotReloadPlugin = require("craco-plugin-react-hot-reload");

module.exports = {
  webpack: {
    alias: {
      "~": path.resolve(__dirname) + "/src/",
      "react-dom": "@hot-loader/react-dom"
    }
  },
  plugins: [
    {
      plugin: reactHotReloadPlugin
    }
  ]
};
