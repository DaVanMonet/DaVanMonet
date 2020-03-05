const path = require("path");
const fs = require("fs-extra");
const chalk = require("chalk");
const dvmConfig = require("./load-config").dvmConfig();

exports.copyAssets = function() {
  if (
    dvmConfig.compilation.copyAssetsToFolder === true &&
    dvmConfig.assets &&
    dvmConfig.assets.length > 0
  ) {
    dvmConfig.assets.forEach(assetsItem => {
      if (typeof assetsItem.dest !== "object") return;

      const srcPath = path.resolve(process.cwd(), assetsItem.src);
      assetsItem.dest.forEach(dest => {
        const destPath = path.resolve(process.cwd(), dest);
        fs.mkdirSync(path.dirname(destPath), { recursive: true });
        fs.copySync(srcPath, destPath);
        console.log(
          chalk.green('>> Copied "' + assetsItem.src + '" to "' + dest + '"')
        );
      });
    });
  }
};

exports.copySrc = function() {
  const srcPath = path.resolve(process.cwd(), dvmConfig.directories.src);
  const distWebDest = path.resolve(
    process.cwd(),
    dvmConfig.directories.dist_web + "/" + dvmConfig.directories.src
  );
  const distPackageDest = path.resolve(
    process.cwd(),
    dvmConfig.directories.dist_package + "/src"
  );

  fs.mkdirSync(path.dirname(distWebDest), { recursive: true });
  fs.copySync(srcPath, distWebDest);
  console.log(
    chalk.green('>> Copied "' + srcPath + '" to "' + distWebDest + '"')
  );

  fs.mkdirSync(path.dirname(distPackageDest), { recursive: true });
  fs.copySync(srcPath, distPackageDest);
  console.log(
    chalk.green('>> Copied "' + srcPath + '" to "' + distPackageDest + '"')
  );
};

// Copy content index to web root
exports.copyContentIndex = function() {
  const srcPath = path.resolve(
    process.cwd(),
    dvmConfig.directories.indexes + "/" + dvmConfig.indexing.contentIndexOutput
  );
  const destPath = path.resolve(
    process.cwd(),
    dvmConfig.directories.dist_web + "/" + dvmConfig.indexing.contentIndexOutput
  );

  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.copySync(srcPath, destPath);
  console.log(chalk.green('>> Copied "' + srcPath + '" to "' + destPath + '"'));
};

// Copy additional package resources into the package dist folder
exports.copyAdditionalWebResources = function() {
  if (dvmConfig.build && dvmConfig.build.web && dvmConfig.build.web.files) {
    dvmConfig.build.web.files
      .filter(x => typeof x.src === "string")
      .forEach(fileObj => {
        const dest = fileObj.dest
          ? fileObj.dest
          : fileObj.src.lastIndexOf("/") > 3
          ? fileObj.src.substring(
              fileObj.src.lastIndexOf("/") + 1,
              fileObj.src.length
            )
          : fileObj.src;
        const fileSrcPath = path.resolve(process.cwd(), fileObj.src);
        const fileDestPath = path.resolve(
          process.cwd(),
          dvmConfig.directories.dist_web + "/" + dest
        );
        if (fs.existsSync(fileSrcPath)) {
          fs.mkdirSync(path.dirname(fileDestPath), { recursive: true });
          fs.copySync(fileSrcPath, fileDestPath);
          console.log(
            chalk.green(
              '>> Copied "' + fileSrcPath + '" to "' + fileDestPath + '"'
            )
          );
        } else {
          console.log(
            chalk.red(
              '>> Could not find  "' +
                fileSrcPath +
                ". Is the configuration correct?"
            )
          );
        }
      });
  }
};

// Copy additional package resources into the package dist folder
exports.copyAdditionalPackageResources = function() {
  const srcDirectoryPath = path.resolve(
    process.cwd(),
    dvmConfig.directories.dist_web + "/" + dvmConfig.directories.css_subDir
  );
  const srcDirectoryDestPath = path.resolve(
    process.cwd(),
    dvmConfig.directories.dist_package + "/css"
  );

  fs.mkdirSync(path.dirname(srcDirectoryDestPath), { recursive: true });
  fs.copySync(srcDirectoryPath, srcDirectoryDestPath);
  console.log(
    chalk.green(
      '>> Copied "' + srcDirectoryPath + '" to "' + srcDirectoryDestPath + '"'
    )
  );

  if (
    dvmConfig.build &&
    dvmConfig.build.package &&
    dvmConfig.build.package.files
  ) {
    dvmConfig.build.package.files
      .filter(x => typeof x.src === "string")
      .forEach(fileObj => {
        const dest = fileObj.dest
          ? fileObj.dest
          : fileObj.src.lastIndexOf("/") > 3
          ? fileObj.src.substring(
              fileObj.src.lastIndexOf("/") + 1,
              fileObj.src.length
            )
          : fileObj.src;
        const fileSrcPath = path.resolve(process.cwd(), fileObj.src);
        const fileDestPath = path.resolve(
          process.cwd(),
          dvmConfig.directories.dist_package + "/" + dest
        );
        if (fs.existsSync(fileSrcPath)) {
          fs.mkdirSync(path.dirname(fileDestPath), { recursive: true });
          fs.copySync(fileSrcPath, fileDestPath);
          console.log(
            chalk.green(
              '>> Copied "' + fileSrcPath + '" to "' + fileDestPath + '"'
            )
          );
        } else {
          console.log(
            chalk.red(
              '>> Could not find  "' +
                fileSrcPath +
                ". Is the configuration correct?"
            )
          );
        }
      });
  }
};
