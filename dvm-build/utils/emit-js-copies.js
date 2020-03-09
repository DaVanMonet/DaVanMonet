const fs = require("fs-extra");
const chalk = require("chalk");

const dvmConfig = require("../utils/load-config").dvmConfig();

module.exports = function(assets, dests) {
  const destinations = typeof dests === "string" ? [dests] : dests;

  const jsTargets = Object.keys(dvmConfig.compilation.targets).filter(t =>
    t.endsWith(".js")
  );

  for (asset of assets) {
    const name = asset.name.replace(".js.js", ".js");
    if (!jsTargets.includes(name.split("/").slice(-1)[0])) continue;

    // Get filename from the key, which might be a longer path
    const file_name = name.replace(/^.*[\\\/]/, "");
    const file_content = asset.source.source();

    // Iterate destinations
    destinations.forEach(dest => {
      // // Write file to location specified in config
      // // Note: Directory must exist. We will not handle nonexistent dirs here
      const file_dest = dest + "/" + file_name;
      fs.outputFile(file_dest, file_content, err => {
        if (err) throw err;
        console.log(chalk.green("JS copy emitted to " + file_dest));
        console.log(
          chalk.green(
            "JS file size: " +
              Math.round((file_content.length / 1024) * 100) / 100 +
              " kb"
          )
        );
      });
    });
  }
};
