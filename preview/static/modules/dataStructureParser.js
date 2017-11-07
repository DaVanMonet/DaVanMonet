"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(["require", "exports", "marked", "modules/loader"], factory);
	} else {
		// Browser globals
		root.amdWeb = factory(root.b);
	}
})(undefined, function (require, exports, marked, Loader) {
	var DataStructureParser = function () {
		function DataStructureParser() {
			var configuration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

			_classCallCheck(this, DataStructureParser);

			this._state = {
				dataLoaded: false
			};
			this._projectConfig = {};
			this._contentIndex = {};
			this._navigation = [];
			this._indexLookup = {};
			this._navigationLookup = {};

			// We match ## as headline for a snipplet
			this.regex = {
				findSnipplet: new RegExp("((?:##)(.|\w|\W|\r|\n)*?(```$))", "gim"),
				findMarkdownH2: new RegExp("(?:##)(.|\r|\n)*?^", "gim"),
				findMarkdownCodeblock: new RegExp("(```html)(.|\w|\W|\r|\n)*?(```)", "gim")
			};

			this._configuration = {
				"sourceDirectory": "",
				"groupNavigationalItemsByKey": ""
			};
			Object.assign(this._configuration, configuration);
		}

		_createClass(DataStructureParser, [{
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
										_context.next = 6;
										break;
									}

									_context.next = 3;
									return Loader.LoadData();

								case 3:

									this._projectConfig = Loader.ProjectConfig;
									this._contentIndex = Loader.ContentIndex;
									this._state.dataLoaded = true;

								case 6:
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
			key: "adjustMarkdownMarkup",
			value: function adjustMarkdownMarkup(markuptext) {
				var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
					removeH1: true
				};

				var markup = document.createElement('div');
				markup.innerHTML = markuptext;
				if (options.removeH1) {
					var arrayH1 = markup.querySelectorAll('h1');
					arrayH1.forEach(function (h1) {
						h1.parentNode.removeChild(h1);
					});
				}
				return markup.innerHTML;
			}
		}, {
			key: "getCodeSnipplets",
			value: function getCodeSnipplets(markdowntext) {
				var _this = this;

				var snippletsTexts = this.extractCodeSnipplets(markdowntext);
				var snipplets = [];
				var base = this;
				if (snippletsTexts.length > 0) {
					snippletsTexts.forEach(function (text, i) {
						if (typeof text === "string" && text.length > 0) {
							//Get headline from snipplet text
							var headlineMatch = _this.matchFromRegEx(text, base.regex.findMarkdownH2);
							var headline = headlineMatch.length > 0 ? headlineMatch[0].replace(/#/ig, "").trim() : "";

							// Fetch codeblock
							var codeMatch = _this.matchFromRegEx(text, base.regex.findMarkdownCodeblock);
							var code = codeMatch.length > 0 ? codeMatch[0].replace(/```html/ig, "").replace(/```/ig, "").trim() : "";

							// Fetch comment by removing code and headline
							var parsedContent = marked(text);
							var markup = document.createElement('div');
							markup.innerHTML = parsedContent;
							var itemsToRemove = markup.querySelectorAll('h2, h3, h4, pre');
							itemsToRemove.forEach(function (item) {
								item.parentNode.removeChild(item);
							});

							var description = markup.innerHTML;
							var item = {
								Title: headline,
								code: code,
								PreviewMarkup: code,
								RenderSource: code,
								Preamble: description,
								parsedcontent: parsedContent,
								markdownsource: text
							};

							snipplets.push(item);
						}
					});
				}
				return snipplets;
			}
		}, {
			key: "extractCodeSnipplets",
			value: function extractCodeSnipplets(markdowntext) {
				var snipplets = this.matchFromRegEx(markdowntext, this.regex.findSnipplet);
				return snipplets;
			}
		}, {
			key: "matchFromRegEx",
			value: function matchFromRegEx(text, regex) {
				var matches = [];
				if (typeof regex !== "undefined") {
					var regExGetsnipplet = regex;
					var m = void 0;

					while ((m = regExGetsnipplet.exec(text)) !== null) {
						// This is necessary to avoid infinite loops with zero-width matches
						if (m.index === regExGetsnipplet.lastIndex) {
							regExGetsnipplet.lastIndex++;
						}

						// The result can be accessed through the `m`-variable.
						m.forEach(function (match, groupIndex) {
							if (groupIndex === 0) {
								//Add match to array result
								matches.push(match);
							}
						});
					}
				} else {
					console.log('Undefined regex');
				}
				return matches;
			}
		}, {
			key: "cleanMarkdown",
			value: function cleanMarkdown() {
				var markdowntext = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
				var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { removeMetadata: true, removeSnipplets: false };

				if (options.removeMetadata === true && markdowntext.indexOf('---') === 0) {
					markdowntext = markdowntext.substring(markdowntext.substring(3, markdowntext.length).indexOf("---") + 7, markdowntext.length);
				}
				if (options.removeSnipplets === true) {
					markdowntext = markdowntext.replace(this.regex.findSnipplet, '');
				}
				return markdowntext;
			}
		}, {
			key: "createIndexLookup",
			value: function () {
				var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
					return regeneratorRuntime.wrap(function _callee2$(_context2) {
						while (1) {
							switch (_context2.prev = _context2.next) {
								case 0:
									_context2.next = 2;
									return this.loadData();

								case 2:
									_context2.next = 4;
									return this.iterateAndAssignToLookup(this._contentIndex.structure, "_indexLookup", "shortpath");

								case 4:
									return _context2.abrupt("return", this._indexLookup);

								case 5:
								case "end":
									return _context2.stop();
							}
						}
					}, _callee2, this);
				}));

				function createIndexLookup() {
					return _ref2.apply(this, arguments);
				}

				return createIndexLookup;
			}()
		}, {
			key: "createIndexNavigationLookup",
			value: function () {
				var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
					return regeneratorRuntime.wrap(function _callee3$(_context3) {
						while (1) {
							switch (_context3.prev = _context3.next) {
								case 0:
									_context3.next = 2;
									return this.loadData();

								case 2:
									_context3.next = 4;
									return this.getNavigation();

								case 4:
									_context3.next = 6;
									return this.iterateAndAssignToLookup(this._navigation, "_navigationLookup", "href");

								case 6:
									return _context3.abrupt("return", this._navigationLookup);

								case 7:
								case "end":
									return _context3.stop();
							}
						}
					}, _callee3, this);
				}));

				function createIndexNavigationLookup() {
					return _ref3.apply(this, arguments);
				}

				return createIndexNavigationLookup;
			}()
		}, {
			key: "iterateAndAssignToLookup",
			value: function () {
				var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(data, lookupObjKey) {
					var _this2 = this;

					var qualifyKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "shortpath";
					var childKey = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "items";
					var iterateItem;
					return regeneratorRuntime.wrap(function _callee4$(_context4) {
						while (1) {
							switch (_context4.prev = _context4.next) {
								case 0:
									if ((typeof data === "undefined" ? "undefined" : _typeof(data)) === "object" && data.length !== 0 && Object.keys(this[lookupObjKey]).length === 0) {
										iterateItem = function iterateItem(item, i) {
											// Assign to lookup table
											typeof item[qualifyKey] === "string" ? _this2[lookupObjKey][item[qualifyKey]] = item : 1;
											// Iterate children
											_typeof(item[childKey]) === "object" && item[childKey].length !== 0 ? item[childKey].forEach(iterateItem.bind(_this2)) : 1;
										};

										data.forEach(iterateItem.bind(this));
									}

								case 1:
								case "end":
									return _context4.stop();
							}
						}
					}, _callee4, this);
				}));

				function iterateAndAssignToLookup(_x7, _x8) {
					return _ref4.apply(this, arguments);
				}

				return iterateAndAssignToLookup;
			}()
		}, {
			key: "getNavigation",
			value: function () {
				var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
					var uniqueKey, result, iterateItem;
					return regeneratorRuntime.wrap(function _callee5$(_context5) {
						while (1) {
							switch (_context5.prev = _context5.next) {
								case 0:
									_context5.next = 2;
									return this.loadData();

								case 2:
									if (this._navigation.length === 0) {
										uniqueKey = this._configuration.groupNavigationalItemsByKey;

										if (uniqueKey.length === 0) {
											uniqueKey = "componentid";
										}
										result = [], iterateItem = function iterateItem(item, i, parentArray) {
											var resultItem = {
												"title": item["title"],
												"guid": item["guid"],
												"variantid": item["variantid"],
												"componentid": item["componentid"]
											},
											    childitems = [];
											if (item["type"] === "file") {
												resultItem["href"] = item["shortpath"];
											}
											if (typeof item[uniqueKey] !== "undefined") {
												resultItem[uniqueKey] = item[uniqueKey];
											}

											if (_typeof(item["items"]) === "object" && item["items"].length > 0) {
												item["items"].forEach(function (childItem, j, resultItem) {
													iterateItem(childItem, j, childitems);
												});

												if (childitems.length > 0) {
													var itemsByKey = {};
													//Loop through the items and check if there already exists a item with the same unique key
													childitems.forEach(function (childitem, k) {
														var key = typeof childitem[uniqueKey] === "string" ? childitem[uniqueKey] : "itemkey" + k;
														if (typeof itemsByKey[key] === "undefined") {
															itemsByKey[key] = childitem;
														} else {
															//We found another item with the same unique key value
															//Set the parent items title and reduce the path with one
															var hasVariants = typeof itemsByKey[key]["variants"] !== "undefined";
															var variants = hasVariants ? itemsByKey[key]["variants"] : [];
															var trashVariable = void 0;
															if (!hasVariants) {
																variants.push(_extends({ items: trashVariable }, itemsByKey[key]));
															}
															variants.push(_extends({ items: trashVariable }, childitem));

															itemsByKey[key]["variants"] = variants;
															//Override the itemkey with the parent item's
															itemsByKey[key]["title"] = item["title"];
															itemsByKey[key]["href"] = item["shortpath"];
															itemsByKey[key]["guid"] = null;
															itemsByKey[key]["variantid"] = null;
														}
													});
													childitems = [];
													//Loop through the new uniquely grouped items
													for (var key in itemsByKey) {
														childitems.push(itemsByKey[key]);
													}
												}
												resultItem["items"] = childitems;
											}
											parentArray.push(resultItem);
										};


										this._contentIndex.structure.forEach(function (item, i) {
											iterateItem(item, i, result);
										});
										this._navigation = result;
									}

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

		return DataStructureParser;
	}();

	return DataStructureParser;
});
