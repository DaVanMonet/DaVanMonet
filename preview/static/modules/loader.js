"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(["jquery", "js-yaml"], factory);
    } else {
        // Browser globals
        root.amdWeb = factory(root.b);
    }
})(undefined, function ($, yaml) {
    var Loader = function () {
        function Loader() {
            _classCallCheck(this, Loader);
        }

        _createClass(Loader, null, [{
            key: "loadJSONorYAML",
            value: function () {
                var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(path) {
                    var request, yamlText;
                    return regeneratorRuntime.wrap(function _callee$(_context) {
                        while (1) {
                            switch (_context.prev = _context.next) {
                                case 0:
                                    _context.next = 2;
                                    return fetch(path);

                                case 2:
                                    request = _context.sent;

                                    if (!(request.status !== 404)) {
                                        _context.next = 14;
                                        break;
                                    }

                                    if (!(path.indexOf('.json') !== -1)) {
                                        _context.next = 10;
                                        break;
                                    }

                                    _context.next = 7;
                                    return request.json();

                                case 7:
                                    return _context.abrupt("return", _context.sent);

                                case 10:
                                    _context.next = 12;
                                    return request.text();

                                case 12:
                                    yamlText = _context.sent;
                                    return _context.abrupt("return", yaml.safeLoad(yamlText));

                                case 14:
                                case "end":
                                    return _context.stop();
                            }
                        }
                    }, _callee, this);
                }));

                function loadJSONorYAML(_x) {
                    return _ref.apply(this, arguments);
                }

                return loadJSONorYAML;
            }()
        }, {
            key: "LoadData",
            value: function () {
                var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                    var requestbase, rootConfig, mainConfigPath, mainconfig, userConfig, contentIndexPath, contentIndexReq, targetIndexPath, targetIndexReq;
                    return regeneratorRuntime.wrap(function _callee2$(_context2) {
                        while (1) {
                            switch (_context2.prev = _context2.next) {
                                case 0:
                                    if (!Loader.HasLoaded) {
                                        _context2.next = 2;
                                        break;
                                    }

                                    return _context2.abrupt("return");

                                case 2:
                                    requestbase = "//" + window.location.host + "/";

                                    // Fetch root confg (to find out where the actual config is located)

                                    _context2.next = 5;
                                    return this.loadJSONorYAML(requestbase + 'config-root.json');

                                case 5:
                                    rootConfig = _context2.sent;


                                    // Fetch project configuration
                                    mainConfigPath = typeof rootConfig.config === "string" ? rootConfig.config : 'patternlibraryconfig.json';
                                    _context2.next = 9;
                                    return this.loadJSONorYAML(mainConfigPath);

                                case 9:
                                    mainconfig = _context2.sent;

                                    if (!((typeof mainconfig === "undefined" ? "undefined" : _typeof(mainconfig)) !== "object")) {
                                        _context2.next = 13;
                                        break;
                                    }

                                    console.error('Could not parse project config (' + requestbase + mainConfigPath + ')');
                                    return _context2.abrupt("return");

                                case 13:
                                    if (!(typeof mainconfig.userconfig === "string" && mainconfig.userconfig.length > 0)) {
                                        _context2.next = 18;
                                        break;
                                    }

                                    _context2.next = 16;
                                    return this.loadJSONorYAML(requestbase + mainconfig.userconfig);

                                case 16:
                                    userConfig = _context2.sent;

                                    if ((typeof userConfig === "undefined" ? "undefined" : _typeof(userConfig)) === "object") {
                                        $.extend(true, mainconfig, userConfig);
                                    }

                                case 18:
                                    Loader.ProjectConfig = mainconfig;

                                    // Fetch content index
                                    contentIndexPath = requestbase + Loader.ProjectConfig.directories.indexes + '/' + Loader.ProjectConfig.indexing.contentindexoutput;
                                    _context2.next = 22;
                                    return fetch(contentIndexPath);

                                case 22:
                                    contentIndexReq = _context2.sent;

                                    if (!(contentIndexReq.status !== 404)) {
                                        _context2.next = 29;
                                        break;
                                    }

                                    _context2.next = 26;
                                    return contentIndexReq.json();

                                case 26:
                                    Loader.ContentIndex = _context2.sent;
                                    _context2.next = 31;
                                    break;

                                case 29:
                                    console.error('Unable to load Content Index (' + contentIndexPath + ')');
                                    return _context2.abrupt("return");

                                case 31:

                                    // Fetch css target index
                                    targetIndexPath = requestbase + Loader.ProjectConfig.directories.indexes + '/' + Loader.ProjectConfig.indexing.targetindexoutput;
                                    _context2.next = 34;
                                    return fetch(targetIndexPath);

                                case 34:
                                    targetIndexReq = _context2.sent;

                                    if (!(targetIndexReq.status !== 404)) {
                                        _context2.next = 41;
                                        break;
                                    }

                                    _context2.next = 38;
                                    return targetIndexReq.json();

                                case 38:
                                    Loader.TargetIndex = _context2.sent;
                                    _context2.next = 42;
                                    break;

                                case 41:
                                    console.error('Unable to load Target Index (' + targetIndexPath + ')');

                                case 42:
                                    Loader.HasLoaded = true;

                                case 43:
                                case "end":
                                    return _context2.stop();
                            }
                        }
                    }, _callee2, this);
                }));

                function LoadData() {
                    return _ref2.apply(this, arguments);
                }

                return LoadData;
            }()
        }]);

        return Loader;
    }();

    Loader.ContentIndex = {};
    Loader.TargetIndex = {};
    Loader.ProjectConfig = {};
    Loader.HasLoaded = false;

    return Loader;
});
