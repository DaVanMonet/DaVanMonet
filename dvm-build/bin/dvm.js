#!/usr/bin/env node

const DaVanMonet = require("../davanmonet.js");
const dvm = new DaVanMonet({ verbose : true });
require('yargs')
	.usage('$0 <cmd> [args]')
	.command('build [target]', 'Starts the build (all, package, web)', (yargs) =>
	{
		yargs.positional('target',
		{
			type: 'string',
			default: 'all',
			describe: 'Select a target [all, package, web] to initiate the build'
		})
	}, function(argv)
	{
		switch (argv.target)
		{
			case 'package':
				dvm.BuildPackage();
				break;
			case 'web':
				dvm.BuildWeb();
				break;
			case 'all':
			default:
				dvm.BuildAll();
				break;
		}
	})
	.command('dev', 'Starts the development server', (yargs) =>
	{
	}, function()
	{
		dvm.StartDevServer();
	})
	.help()
	.argv
