require.config({
	paths:
	{
		'jquery':'/lib/jquery@3.2.1/jquery.min',
		'tslib':'/lib/tslib@1.8.0/tslib',
		'js-yaml':'/lib/js-yaml@3.10.0/js-yaml.min'
	}
});

define(['jquery'], ($) =>
{
	const renderElm = document.body.querySelector('.showcase__render');
	const loadModules = () => 
	{
		if(typeof renderElm.dataset["requirejsModules"] === "string")
		{
			const modules = renderElm.dataset["requirejsModules"].split(',');
			const baseurl = renderElm.dataset["requirejsBaseurl"];
			const modulesToLoad = modules.map((modulePath) =>
			{
				if(modulePath.indexOf('/') !== -1)
				{
					return baseurl + ((baseurl.lastIndexOf('/') !== baseurl.length-1) ? "/" : "" ) + modulePath.trim()
				}
				return modulePath.trim()
			});
			if(modulesToLoad.length > 0)
			{
				require(modulesToLoad);
			}
		}
	}
	renderElm.addEventListener('LoadModulesInIframe', loadModules,true);
	loadModules();
});
