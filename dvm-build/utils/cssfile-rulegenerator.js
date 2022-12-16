const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const dvmConfig = require("../utils/load-config").dvmConfig();

module.exports = function() {
  let additionalPlugins = [];
  let additionalRules = [];

  let loader_specs = {};

  // Loop targets
  for (t_key of Object.keys(dvmConfig.compilation.targets).filter(t =>
    t.endsWith(".css")
  )) {
    // We only care about CSS targets here
    let t = dvmConfig.compilation.targets[t_key];

    // Look for less files
    if (
      loader_specs["less"] === undefined &&
      t.find(f => f.endsWith(".less"))
    ) {
      loader_specs["less"] = {
        test: /\.less$/,
        loader: "less-loader"
      };

      continue;
    } // less

    // Look for sass files
    if (
      loader_specs["sass"] === undefined &&
      t.find(f => f.endsWith(".sass") || f.endsWith(".scss"))
    ) {
      // Include paths for SCSS
      var scssIncPaths =
        dvmConfig.compilation.compilers.scss.includePaths || [];

      var implementation = dvmConfig.compilation.compilers.scss.implementation;

      loader_specs["sass"] = {
        test: /\.s[c|a]ss$/,
        loader: "sass-loader",
        options: {
          sassOptions: {
            includePaths: scssIncPaths.map(incPath =>
              path.resolve(process.cwd(), incPath)
            )
          }
        }
      };

      if (implementation) {
        loader_specs["sass"].options.implementation = require(implementation);
      }

      continue;
    } // sass
  } // for

  let postCssLoader = [];
  if (dvmConfig.compilation.postcss === true)
    postCssLoader = [{ loader: "postcss-loader" }];

  // Create neccesary loaders
  for (ls_key in loader_specs) {
    const specifiedLoader = {
      loader: loader_specs[ls_key].loader, // 1. Preprocess
      options: loader_specs[ls_key].options
    };
    const miniCssExtractLoader = {
      loader: MiniCssExtractPlugin.loader
    };
    const loader = {
      test: loader_specs[ls_key].test,
      use: [
        miniCssExtractLoader,
        "css-loader",
        ...postCssLoader,
        specifiedLoader
      ]
    };

    additionalRules.push(loader);
  }

  // Create plugin dependencies
  additionalPlugins.push(
    new MiniCssExtractPlugin({
      filename: dvmConfig.directories.css_subDir + "/[name]"
    })
  );

  return { additionalRules, additionalPlugins };
};
