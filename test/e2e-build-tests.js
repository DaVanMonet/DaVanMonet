const expect = require("chai").expect;
const fs = require('fs-extra');
const load_config = require("../dvm-build/utils/load-config");
const path = require('path')

describe("Testing DvM build process", function()
{
	it("Builds DvM and Pattern Library", async function()
	{
		this.timeout(40000);
		
		const dvmConfig = load_config.dvmConfig();
		let destinationsToVerify = [
			dvmConfig.directories.dist_package + "/version.json",
			dvmConfig.directories.dist_package + "/src",
			dvmConfig.directories.dist_package + "/css",
			dvmConfig.directories.dist_web + "/index.html",
			dvmConfig.directories.indexes + "/" + dvmConfig.indexing.contentIndexOutput,
			path.posix.join(dvmConfig.directories.dist_web, dvmConfig.directories.js_subDir),
		];

		// Verify additional file for package dist
		if (dvmConfig.build.package && dvmConfig.build.package.files)
		{
			dvmConfig.build.package.files.forEach(fileObj =>
			{
				const dest = (fileObj.dest) ? fileObj.dest : (fileObj.src.lastIndexOf("/") > 3) ? fileObj.src.substring(fileObj.src.lastIndexOf("/") + 1, fileObj.src.length) : fileObj.src;
				destinationsToVerify.push(path.posix.join(dvmConfig.directories.dist_package, dest));
			});

			// Verify additional file for web dist
			if (dvmConfig.build.web && dvmConfig.build.web.files)
			{
				dvmConfig.build.web.files.forEach(fileObj =>
				{
					const dest = (fileObj.dest) ? fileObj.dest : (fileObj.src.lastIndexOf("/") > 3) ? fileObj.src.substring(fileObj.src.lastIndexOf("/") + 1, fileObj.src.length) : fileObj.src;
					destinationsToVerify.push(path.posix.join(dvmConfig.directories.dist_web, dest));
				});
			}
		}

		// Verify the outputted css files
		if (dvmConfig.compilation && dvmConfig.compilation.targets)
		{
			for (t_key of Object.keys(dvmConfig.compilation.targets).filter(t => t.endsWith('.css')))
			{
				destinationsToVerify.push(path.posix.join(dvmConfig.directories.dist_package,"css",t_key));
			}
			
		}
		// Temporarily disable console.log
		let consolelogtmp = console.log;
		console.log = msg => { /* Nope! */ };

		let build_dvm = require('../dvm-build/build-dvm');
		await build_dvm.ready;

		let build_patternlibrary = require('../dvm-build/build-patternlibrary');
		await build_patternlibrary.ready;

		// Restore console.log
		console.log = consolelogtmp;

		destinationsToVerify.forEach(p => expect(fs.existsSync(p), 'path ' + p + ' is missing').to.be.true);
	})

});
