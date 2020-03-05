class HookPlugin {
  constructor(hookCallbacks) {
    this.emitCb = hookCallbacks.emit;
    this.doneCb = hookCallbacks.done;
  }

  apply(compiler) {
    if (this.emitCb) compiler.hooks.emit.tap("Emit Hook Plugin", this.emitCb);
    if (this.doneCb) compiler.hooks.done.tap("Emit Hook Plugin", this.doneCb);
  }
}

module.exports = HookPlugin;
