'use strict';

require.config({
	paths: {
		'jquery': '/lib/jquery@3.2.1/jquery.min',
		'tslib': '/lib/tslib@1.8.0/tslib'
	}
});

define(['jquery'], function ($) {
	var renderElm = document.body.querySelector('.showcase__render');
	var loadModules = function loadModules() {
		if (typeof renderElm.dataset["requirejsModules"] === "string") {
			var modules = renderElm.dataset["requirejsModules"].split(',');
			var baseurl = renderElm.dataset["requirejsBaseurl"];
			var modulesToLoad = modules.map(function (modulePath) {
				if (modulePath.indexOf('/') !== -1) {
					return baseurl + (baseurl.lastIndexOf('/') !== baseurl.length - 1 ? "/" : "") + modulePath.trim();
				}
				return modulePath.trim();
			});
			if (modulesToLoad.length > 0) {
				require(modulesToLoad);
			}
		}
	};
	renderElm.addEventListener('LoadModulesInIframe', loadModules, true);
	loadModules();
});
