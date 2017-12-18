const path = require('path');

module.exports = class DaVanMonet
{
	constructor(options = { verbose:false })
	{
		this.options = options;
		this.output = (this.options.verbose) ? (content) => console.log(content) : () => {};
		this.exec = (cmd) =>
		{
			// "cwd":process.cwd(),
			// "cwd":__dirname,
			const result = require('child_process').execSync(cmd, { "cwd": process.cwd() , "stdio": 'inherit' });
			return (result) ? result.toString().trim() : null;
		}
	}
	StartDevServer()
	{
		const result = this.exec("node " + path.join(__dirname, "dev-server.js"));
		this.output(result)
	}
	BuildAll()
	{
		this.BuildPackage();
		this.BuildWeb();
		//this.output("All builds have been completed");
	}
	BuildPackage()
	{
		this.output('Build package...')
		const result = this.exec("node " + path.join(__dirname, "build-patternlibrary.js"));
		//this.output(result)
	}
	BuildWeb()
	{
		this.output('Build web...')
		const result = this.exec("node " + path.join(__dirname, "build-dvm.js"));
		//this.output(result)
	}

	

}


