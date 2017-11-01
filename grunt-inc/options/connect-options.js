/* ### Connect https://github.com/gruntjs/grunt-contrib-connect
	Starts webserver with preview website */
module.exports = function(_gruntbase_) {
	
	const mainconfig = _gruntbase_.mainconfig;
	const _ = require('lodash');
	
	const fs = require('fs');
	const path = require('path');
	const url = require('url');
	const util = require('util');

    return {
		livereload:
		{
			options:
			{
				port: mainconfig.developmentenvironment.devwebsiteport,
				base: _.union([__dirname + '/../../preview', "./", mainconfig.directories.build]),
				keepalive:false, //Set to true if not running watch
				open: mainconfig.developmentenvironment.launchbrowser,
				middleware: function(connect, options, middlewares)
				{
					// inject a custom middleware into the array of default middlewares
					middlewares.unshift(function(req, res, next)
					{
						if(req.url.indexOf('.vue') !== -1)
						{
							//res.setHeader('Content-Type', 'application/json'); 
							res.setHeader('Content-Type', 'text/html; charset=UTF-8'); 
						}
						// console.log('res', res)
						// console.log('req url', req.url)
						// console.log('fs.existsSync(req.url)',fs.existsSync(req.url))
						// console.log('fs.existsSync(req.url.substr(1))',fs.existsSync(req.url.substr(1)))
						// //console.log(req);
						return next();
					});
		  
					return middlewares;
				}
			}
		},
		build:
		{
			options:
			{
				port: mainconfig.developmentenvironment.buildwebsiteport,
				base: [mainconfig.directories.build],
				keepalive:true //Set to true if not running watch
			}
		}
	};
}