"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = function () {
	function LifecyclePlugin(options) {
		_classCallCheck(this, LifecyclePlugin);

		this.options = options ? options : {};
	}

	_createClass(LifecyclePlugin, [{
		key: "apply",
		value: function apply(compiler) {
			var pluginOptions = this.options;
			// https://webpack.js.org/api/compiler/#event-hooks
			var hooksWithOneParam = ["after-plugins", "after-resolvers", "before-run", "run", "watch-run", "normal-module-factory", "context-module-factory", "before-compile", "compile", "this-compilation", "compilation", "make", "after-compile", "should-emit", "emit", "after-emit", "done", "failed"];
			var hooksWithTwoParams = ["invalid"];

			var hooksWithoutParam = ["entry-option", "environment", "after-environment", "need-additional-pass", "watch-close"];

			hooksWithOneParam.filter(function (x) {
				return typeof pluginOptions[x] === "function";
			}).forEach(function (hook) {
				compiler.plugin(hook, function (paramOne, callback) {
					pluginOptions[hook](paramOne, this.options, pluginOptions);
					typeof callback === "function" && callback();
				});
			});

			hooksWithTwoParams.filter(function (x) {
				return typeof pluginOptions[x] === "function";
			}).forEach(function (hook) {
				compiler.plugin(hook, function (paramOne, paramTwo, callback) {
					pluginOptions[hook](paramOne, paramTwo, this.options, pluginOptions);
					typeof callback === "function" && callback();
				});
			});

			hooksWithoutParam.filter(function (x) {
				return typeof pluginOptions[x] === "function";
			}).forEach(function (hook) {
				compiler.plugin(hook, function (callback) {
					pluginOptions[hook](this.options, pluginOptions);
					typeof callback === "function" && callback();
				});
			});
		}
	}]);

	return LifecyclePlugin;
}();
