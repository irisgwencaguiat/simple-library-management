const path = require("path");

module.exports = {
  transpileDependencies: ["vuetify"],

  outputDir: path.resolve(__dirname, "../app/public"),

  devServer: {
    proxy: {
      "/api": {
        target: `http://localhost:${process.env.PORT || 3000}`,
      },
    },
  },
};
