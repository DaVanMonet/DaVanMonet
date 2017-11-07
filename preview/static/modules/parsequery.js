'use strict';

(function (root, factory) {
				if (typeof define === 'function' && define.amd) {
								// AMD. Register as an anonymous module.
								define([''], factory);
				} else {
								// Browser globals
								root.amdWeb = factory(root.b);
				}
})(undefined, function () {
				function parseQuery(search) {
								if (search && search.indexOf('?') !== -1) {
												search = search.substring(search.indexOf('?'), search.length);
								}
								var args = search.substring(1).split('&');

								var argsParsed = {};

								var i, arg, kvp, key, value;

								for (i = 0; i < args.length; i++) {

												arg = args[i];

												if (-1 === arg.indexOf('=')) {

																argsParsed[decodeURIComponent(arg).trim()] = true;
												} else {

																kvp = arg.split('=');

																key = decodeURIComponent(kvp[0]).trim();

																value = decodeURIComponent(kvp[1]).trim();

																argsParsed[key] = value;
												}
								}

								return argsParsed;
				}
				return parseQuery;
});
