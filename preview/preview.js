require.config({
	paths:
	{
		'jquery':'/lib/jquery@3.2.1/jquery.min',
		'tslib':'/lib/tslib@1.8.0/tslib'
	}
});

define([], () =>
{
	(async () =>
	{
		let requirejsInputfield = document.querySelector('#requirejs-modules');
		if(requirejsInputfield && requirejsInputfield.value && requirejsInputfield.value.length > 0) 
		{
			const requirejsModules = requirejsInputfield.value.split(',');
			const baseurl = requirejsInputfield.dataset["baseurl"] || "";
			const modulesToLoad = requirejsModules.map((modulePath) =>
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
	})();
});
