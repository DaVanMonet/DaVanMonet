"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(["jquery"], factory);
    } else {
        // Browser globals
        root.amdWeb = factory(root.b);
    }
})(undefined, function ($) {
    var Loader = function () {
        function Loader() {
            _classCallCheck(this, Loader);
        }

        _createClass(Loader, null, [{
            key: "LoadData",
            value: function () {
                var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                    var requestbase, configreq, config, userconfigrequest, userconfig, indexreq, targetreq;
                    return regeneratorRuntime.wrap(function _callee$(_context) {
                        while (1) {
                            switch (_context.prev = _context.next) {
                                case 0:
                                    if (!Loader.HasLoaded) {
                                        _context.next = 2;
                                        break;
                                    }

                                    return _context.abrupt("return");

                                case 2:
                                    requestbase = "//" + window.location.host + "/";
                                    // Fetch project configuration

                                    _context.next = 5;
                                    return fetch(requestbase + 'patternlibraryconfig.json');

                                case 5:
                                    configreq = _context.sent;
                                    _context.next = 8;
                                    return configreq.json();

                                case 8:
                                    config = _context.sent;

                                    if (!(typeof config.userconfig === "string" && config.userconfig.length > 0)) {
                                        _context.next = 18;
                                        break;
                                    }

                                    _context.next = 12;
                                    return fetch(requestbase + config.userconfig);

                                case 12:
                                    userconfigrequest = _context.sent;

                                    if (!(userconfigrequest.status !== 404)) {
                                        _context.next = 18;
                                        break;
                                    }

                                    _context.next = 16;
                                    return userconfigrequest.json();

                                case 16:
                                    userconfig = _context.sent;

                                    $.extend(true, config, userconfig);

                                case 18:
                                    Loader.ProjectConfig = config;

                                    // Fetch content index
                                    _context.next = 21;
                                    return fetch(requestbase + Loader.ProjectConfig.indexing.contentindexoutput);

                                case 21:
                                    indexreq = _context.sent;
                                    _context.next = 24;
                                    return indexreq.json();

                                case 24:
                                    Loader.ContentIndex = _context.sent;
                                    _context.next = 27;
                                    return fetch(requestbase + Loader.ProjectConfig.indexing.targetindexoutput);

                                case 27:
                                    targetreq = _context.sent;
                                    _context.next = 30;
                                    return targetreq.json();

                                case 30:
                                    Loader.TargetIndex = _context.sent;

                                    Loader.HasLoaded = true;

                                case 32:
                                case "end":
                                    return _context.stop();
                            }
                        }
                    }, _callee, this);
                }));

                function LoadData() {
                    return _ref.apply(this, arguments);
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
