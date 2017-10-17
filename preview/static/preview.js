require.config({
	paths:
	{
		'lodash':'/lib/lodash@4.16.0/lodash',
		'marked':'/lib/marked@0.3.6/marked',
		'jquery':'/lib/jquery@3.2.1/jquery.min',
		'tslib':'/lib/tslib@1.8.0/tslib'
	}
});

define(["jquery","marked","modules/parsequery","modules/loader"], ($, marked, parsequery,Loader) =>
{
	(async () =>
	{
		await Loader.LoadData();
		const projectConfig = Loader.ProjectConfig;
		
		let requirejsInputfield = document.querySelector('#requirejs-modules');
		if(requirejsInputfield && requirejsInputfield.value && requirejsInputfield.value.length > 0) 
		{
			const requirejsModules = requirejsInputfield.value.split(',');
			const modulesToLoad = requirejsModules.map((modulePath) =>
			{
				if(modulePath.indexOf('/') !== -1)
				{
					return "../"+ projectConfig.directories.src +"/"+ modulePath.trim()
				}
				return modulePath.trim()
			});
			if(modulesToLoad.length > 0)
			{
				require(modulesToLoad);
			}
		}
	})();
});
