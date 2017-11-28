module.exports = class LifecyclePlugin
{
	constructor(options)
	{
		this.options = options ? options :
		{};
	}
	apply(compiler)
	{
		const pluginOptions = this.options;
		// https://webpack.js.org/api/compiler/#event-hooks
		const hooksToTrack = ["run", "compilation", "after-compile", "watch-run", "emit", "done"];
		hooksToTrack.forEach((hook) =>
		{
			if (typeof pluginOptions[hook] === "function")
			{
				compiler.plugin(hook, function(compilation, callback)
				{
					pluginOptions[hook](compilation, this.options, pluginOptions);
					if (typeof callback === "function")
					{
						callback();
					}
				});
			}
		});
	}
}
