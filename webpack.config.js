/* eslint-disable no-undef */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

module.exports = {
  mode: "none",
  entry: {
    extension: "./src/extension.ts",
  },
  output: {
    path: path.join(__dirname, "./out/web"),
    libraryTarget: "commonjs",
  },
  resolve: {
    extensions: [".ts"],
    fallback: {
      path: require.resolve("path-browserify"),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader",
          },
        ],
      },
    ],
  },
  externals: {
    vscode: "vscode",
  },
};
