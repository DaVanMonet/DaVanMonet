function LifecyclePlugin (options)
{
  this.pluginOptions = options ? options : {};
}

LifecyclePlugin.prototype.apply = function(compiler)
{
  const pluginOptions = this.pluginOptions;
  // https://webpack.js.org/api/compiler/#event-hooks
  const hooksToTrack = ["run","compilation","after-compile","watch-run","emit", "done"];
  hooksToTrack.forEach((hook) =>
  {
    if(typeof pluginOptions[hook] === "function")
    {
      compiler.plugin(hook, function(compilation, callback)
      {
        pluginOptions[hook](compilation, this.options, pluginOptions);
        if(typeof callback === "function")
        {
          callback();
        }
      });
    }
  });
}
module.exports = LifecyclePlugin;