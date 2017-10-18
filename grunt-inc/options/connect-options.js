/* ### Connect https://github.com/gruntjs/grunt-contrib-connect
	Starts webserver with preview website */
module.exports = function(_gruntbase_) {
	
	let mainconfig = _gruntbase_.mainconfig;
	let _ = require('lodash');
	
    return {
		livereload:
		{
			options:
			{
				port: mainconfig.developmentenvironment.devwebsiteport,
				base: _.union(['./preview', "./", mainconfig.directories.build]),
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