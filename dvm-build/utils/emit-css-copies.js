const fs = require("fs-extra");
const chalk = require("chalk");

module.exports = function(assets, dests) {
  // Set destination to an array and iterate
  const destinations = typeof dests === "string" ? [dests] : dests;

  for (asset of assets) {
    const source = asset.source.source();
    const size = asset.source.size();
    const listmap = asset.source.listMap();
    const node = asset.source.node();
  }

  // Iterate asset keys ending with .css
  for (asset of assets) {
    if (!asset.name.endsWith(".css")) continue;

    // Get filename from the key, which might be a longer path
    const file_name = asset.name.replace(/^.*[\\\/]/, "");
    const file_content = asset.source.source();

    // Iterate destinations
    destinations.forEach(dest => {
      // // Write file to location specified in config
      // // Note: Directory must exist. We will not handle nonexistent dirs here
      const file_dest = dest + "/" + file_name;
      fs.outputFile(file_dest, file_content, err => {
        if (err) throw err;
        console.log(chalk.green("CSS copy emitted to " + file_dest));
        console.log(
          chalk.green(
            "CSS file size: " +
              Math.round((file_content.length / 1024) * 100) / 100 +
              " kb"
          )
        );
      });
    });
  }
};
