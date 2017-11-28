module.exports = class LifecyclePlugin
{
  constructor(options)
  {
    this.options = options ? options : {};
  }
  apply(compiler)
  {
    // https://webpack.js.org/api/compiler/#event-hooks
    const hooksToTrack = ["run","compilation","after-compile","watch-run","emit", "done"];
    hooksToTrack.forEach((hook) =>
    {
      if(typeof options[hook] === "function")
      {
        compiler.plugin(hook, function(compilation, callback)
        {
          options[hook](compilation, this.options, options);
          if(typeof callback === "function")
          {
            callback();
          }
        });
      }
    });
  }
}
