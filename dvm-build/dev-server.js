require('./check-versions')()

var envConfig = require('./env')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(envConfig.dev.env.NODE_ENV)
}

var opn = require('opn')
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfigDvm = require('./webpack/webpack.dvm.dev.conf')
var webpackConfigPL = require('./webpack/webpack.patternlibrary.dev.conf')
var webpackConfig = [webpackConfigDvm, webpackConfigPL];

const dvmConfig = require('./utils/load-config')();

// default port where dev server listens for incoming traffic
var port = dvmConfig.env.devsiteport

// automatically open browser, if not set will be false
var autoOpenBrowser = !!dvmConfig.env.launchbrowser

// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = envConfig.dev.proxyTable

var app = express()
var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: "/",
  quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: false,
  heartbeat: 2000
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(envConfig.dev.assetsPublicPath, envConfig.dev.assetsSubDirectory)
app.use(staticPath, express.static('./dvm-app/static'))
app.use('/' + dvmConfig.directories.src, express.static(dvmConfig.directories.src))

var uri = 'http://localhost:' + port

var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
  _resolve()
})

var server = app.listen(port)

// Start legacy grunt dev task
// var sys = require('sys')
// var exec = require('child_process').exec;
// var child;
// child = exec("grunt dev", function (error, stdout, stderr) {
//   sys.print('stdout: ' + stdout);
//   sys.print('stderr: ' + stderr);
//   if (error !== null) {
//     console.log('grunt dev error: ' + error);
//   }
// });

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
