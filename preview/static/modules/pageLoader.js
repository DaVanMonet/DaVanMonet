"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(["require", "exports", "marked", "modules/loader", "modules/dataStructureParser"], factory);
	} else {
		// Browser globals
		root.amdWeb = factory(root.b);
	}
})(undefined, function (require, exports, marked, Loader, DataStructureParser) {
	var PageLoader = function () {
		function PageLoader() {
			var configuration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

			_classCallCheck(this, PageLoader);

			this._state = {
				dataLoaded: false
			};
			this._projectConfig = {};
			this._contentindex = {};
			this._navigation = [];
			this._indexLookup = {};
			this._navigationLookup = {};
			this._targetindex = {};
			this.dataStructureParser = new DataStructureParser();

			this._configuration = {
				"sourceDirectory": "",
				"groupNavigationalItemsByKey": ""
			};
			Object.assign(this._configuration, configuration);
		}

		_createClass(PageLoader, [{
			key: "isType",
			value: function isType(val, type) {
				return (typeof val === "undefined" ? "undefined" : _typeof(val)) === type && (type !== "string" || type === "string" && val.length > 0);
			}
		}, {
			key: "loadData",
			value: function () {
				var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
					return regeneratorRuntime.wrap(function _callee$(_context) {
						while (1) {
							switch (_context.prev = _context.next) {
								case 0:
									if (!(this._state.dataLoaded === false)) {
										_context.next = 13;
										break;
									}

									_context.next = 3;
									return Loader.LoadData();

								case 3:

									this._projectConfig = Loader.ProjectConfig;
									this._contentindex = Loader.ContentIndex;
									this._targetindex = Loader.TargetIndex;

									_context.next = 8;
									return this.dataStructureParser.createIndexLookup();

								case 8:
									this._indexLookup = _context.sent;
									_context.next = 11;
									return this.dataStructureParser.createIndexNavigationLookup();

								case 11:
									this._navigationLookup = _context.sent;


									this._state.dataLoaded = true;

								case 13:
								case "end":
									return _context.stop();
							}
						}
					}, _callee, this);
				}));

				function loadData() {
					return _ref.apply(this, arguments);
				}

				return loadData;
			}()
		}, {
			key: "getPage",
			value: function () {
				var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(href) {
					var _this = this;

					var base, indexData, navigationalData, pageData, variants, matchOnKey, variantIds;
					return regeneratorRuntime.wrap(function _callee3$(_context3) {
						while (1) {
							switch (_context3.prev = _context3.next) {
								case 0:
									base = this;
									_context3.next = 3;
									return this.loadData();

								case 3:

									if (href.indexOf('/') === 0) {
										href = href.substr(1);
									}
									indexData = this._indexLookup[href];
									navigationalData = this._navigationLookup[href];
									pageData = {
										"id": "",
										"Title": "",
										"Preamble": "",
										"ComponentItems": []
									};

									//When theres is a file matching and no "variants" are present.

									pageData.id = indexData["guid"];
									pageData.Title = indexData["title"];

									variants = [];
									// Structure only contains one file.

									if (indexData["type"] === "file") {
										variants.push(indexData);
									} else if (_typeof(navigationalData["variants"]) === "object" && navigationalData["variants"].length > 0) {
										matchOnKey = "guid";
										variantIds = navigationalData["variants"].map(function (x) {
											return x[matchOnKey];
										});

										variants = indexData["items"].filter(function (x) {
											return variantIds.indexOf(x[matchOnKey]) !== -1;
										});
									}
									//This variable is what we use to match a the MD files with what is contained in the navigational structure
									pageData.id = navigationalData["guid"];
									pageData.title = navigationalData["title"];

									_context3.next = 15;
									return variants.forEach(function () {
										var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(variant, i) {
											var variantContent, filepath, markdownContent, snipplets, cleanedMarkdown, parsedMarkdown, adjustedContent;
											return regeneratorRuntime.wrap(function _callee2$(_context2) {
												while (1) {
													switch (_context2.prev = _context2.next) {
														case 0:
															variantContent = {
																"id": variant["guid"],
																"componentid": variant["componentid"],
																"variantid": variant["variantid"],
																"Title": variant["title"],
																"Content": "",
																"States": [],
																"requirejs": ""
															};
															filepath = variant["shortpath"];

															// Load .md file contents

															_context2.next = 4;
															return base.loadMDFile(filepath);

														case 4:
															markdownContent = _context2.sent;

															// Extract code snipplets from markdown
															snipplets = base.dataStructureParser.getCodeSnipplets(markdownContent);

															if (snipplets.length > 0) {
																//Add additional information to each state (Set by the indexing metadata)
																if (typeof variant["requirejs"] === "string") {
																	snipplets.forEach(function (snipplet) {
																		return snipplet["requirejs"] = variant["requirejs"];
																	});
																}

																variantContent.States = variantContent.States.concat(snipplets);
															}

															// Clean from metadata, (states?) etc.
															cleanedMarkdown = base.dataStructureParser.cleanMarkdown(markdownContent, { removeMetadata: true, removeSnipplets: true });

															// Parse what's left from the markdown files

															parsedMarkdown = marked(cleanedMarkdown, { sanitize: false });

															//Removes H1 etc.

															adjustedContent = base.dataStructureParser.adjustMarkdownMarkup(parsedMarkdown);

															variantContent.Content = adjustedContent;

															pageData["ComponentItems"].push(variantContent);

														case 12:
														case "end":
															return _context2.stop();
													}
												}
											}, _callee2, _this);
										}));

										return function (_x3, _x4) {
											return _ref3.apply(this, arguments);
										};
									}());

								case 15:
									console.log('pageData', pageData);
									return _context3.abrupt("return", pageData);

								case 17:
								case "end":
									return _context3.stop();
							}
						}
					}, _callee3, this);
				}));

				function getPage(_x2) {
					return _ref2.apply(this, arguments);
				}

				return getPage;
			}()
		}, {
			key: "loadMDFile",
			value: function () {
				var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(filepath) {
					var requestbase, fullpath, filereq, filecontent;
					return regeneratorRuntime.wrap(function _callee4$(_context4) {
						while (1) {
							switch (_context4.prev = _context4.next) {
								case 0:
									_context4.next = 2;
									return this.loadData();

								case 2:
									requestbase = "//" + window.location.host + "/";
									fullpath = requestbase + this._projectConfig.directories.src + "/" + filepath + '.md';
									_context4.next = 6;
									return fetch(fullpath);

								case 6:
									filereq = _context4.sent;
									_context4.next = 9;
									return filereq.text();

								case 9:
									filecontent = _context4.sent;
									return _context4.abrupt("return", filecontent);

								case 11:
								case "end":
									return _context4.stop();
							}
						}
					}, _callee4, this);
				}));

				function loadMDFile(_x5) {
					return _ref4.apply(this, arguments);
				}

				return loadMDFile;
			}()
		}, {
			key: "getNavigation",
			value: function () {
				var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
					return regeneratorRuntime.wrap(function _callee5$(_context5) {
						while (1) {
							switch (_context5.prev = _context5.next) {
								case 0:
									_context5.next = 2;
									return this.dataStructureParser.getNavigation();

								case 2:
									this._navigation = _context5.sent;
									return _context5.abrupt("return", this._navigation);

								case 4:
								case "end":
									return _context5.stop();
							}
						}
					}, _callee5, this);
				}));

				function getNavigation() {
					return _ref5.apply(this, arguments);
				}

				return getNavigation;
			}()
		}]);

		return PageLoader;
	}();

	return PageLoader;
});
