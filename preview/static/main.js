'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

require.config({
	paths: {
		'vue': '/lib/vue@2.4.2/vue',
		'lodash': '/lib/lodash@4.16.0/lodash',
		'marked': '/lib/marked@0.3.6/marked',
		'highlight': '/lib/highlight.js@9.12.0/highlight.min',
		'jquery': '/lib/jquery@3.2.1/jquery.min',
		'less': '/lib/less@2.7.2/less.min',
		'es6-promise': '/lib/es6-promise@4.1.1/es6-promise.auto.min',
		'http-vue-loader': '/lib/http-vue-loader@1.3.3/httpVueLoader',
		'babel-polyfill': '/lib/babel-polyfill@6.26.0/polyfill.min',
		'fetch': '/lib/whatwg-fetch@2.0.3/fetch',
		'js-yaml': '/lib/js-yaml@3.10.0/js-yaml.min'
	}
});

define(["babel-polyfill", "fetch", "vue", "less", "jquery", "marked", "highlight", "js-yaml", "modules/pageLoader", "modules/loader", "es6-promise", "http-vue-loader"], function (babelPolyfill, _fetch, Vue, less, $, marked, highlight, yaml, PageLoader, Loader, es6promise, httpVueLoader_) {
	window["highlight"] = highlight;
	var afterRender = function afterRender(href) {
		// $('pre code').each((i, $block) =>
		// {
		// 	highlight.highlightBlock($block);
		// });

		// let $livepreviewAreas = $('[data-livepreview]');
		// $livepreviewAreas.each((i, previewarea) =>
		// {s
		// 	let $previewarea =  $(previewarea);
		// 	let $iframe = $('<iframe src="preview.html?id='+ i +'&path='+ encodeURIComponent(href.replace("#","")) +'"></iframe>');
		// 	$previewarea.after($iframe);
		// 	$previewarea.hide();
		// });
	};
	Vue.use(httpVueLoader);

	var app = new Vue({
		el: '#davanmonet-app',
		components: ["url:/vuecomponents/component/ComponentShowcaseRender.vue", "url:/vuecomponents/Maincontent.vue", "url:/vuecomponents/Navigation.vue"],
		data: {
			configLoaded: false,
			isLocalhost: false,
			navigation: [],
			maincontent: {
				Title: null,
				Preamble: null,
				MainBody: "<p>This project does not yet have a startpage. Create a index.md file in the root folder of your style source</p>"
			},
			projectConfig: {},
			contentIndex: {},
			targetIndex: {},
			pageLookup: {}
		},
		created: function created() {
			this.init(this);
		},
		methods: {
			init: function () {
				var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_vue) {
					return regeneratorRuntime.wrap(function _callee$(_context) {
						while (1) {
							switch (_context.prev = _context.next) {
								case 0:
									_context.next = 2;
									return Loader.LoadData();

								case 2:

									_vue.projectConfig = Loader.ProjectConfig;

									this.isLocalhost = window.location.hostname === "localhost";

									if (this.isLocalhost && _vue.projectConfig.developmentenvironment && _vue.projectConfig.developmentenvironment.livereloadport) {
										$('<script src="//localhost:' + _vue.projectConfig.developmentenvironment.livereloadport + '/livereload.js"></script>').appendTo('body');
									}

									this.fetchData(this).then(function () {});

									// Rudimentary themeing support
									if (_vue.projectConfig.project_info.theme_style !== "default") {
										$('head').append('<link rel="stylesheet" type="text/css" href="' + _vue.projectConfig.project_info.theme_style + '" />');
									}
									$(".davanmonet-header-nav-link").text(_vue.projectConfig.project_info.name);
									$(".davanmonet-header-logo").attr('src', _vue.projectConfig.project_info.logo);

								case 9:
								case 'end':
									return _context.stop();
							}
						}
					}, _callee, this);
				}));

				function init(_x) {
					return _ref.apply(this, arguments);
				}

				return init;
			}(),

			loadPage: function () {
				var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(_vue, path) {
					var _pageLoader, pagedata;

					return regeneratorRuntime.wrap(function _callee2$(_context2) {
						while (1) {
							switch (_context2.prev = _context2.next) {
								case 0:
									if (!(path.length > 1)) {
										_context2.next = 7;
										break;
									}

									_pageLoader = new PageLoader();
									_context2.next = 4;
									return _pageLoader.getPage(path);

								case 4:
									pagedata = _context2.sent;


									this.maincontent = pagedata;
									this.$nextTick(function () {
										afterRender(path);
									});

								case 7:
								case 'end':
									return _context2.stop();
							}
						}
					}, _callee2, this);
				}));

				function loadPage(_x2, _x3) {
					return _ref2.apply(this, arguments);
				}

				return loadPage;
			}(),
			getRepo: function getRepo() {
				return {
					"RepoId": 1,
					"Name": this.projectConfig.project_info.name,
					"BaseUrlToPatternLibrary": "../" + this.projectConfig.directories.src,
					"Stylesheets": this.targetIndex.items
				};
			},

			fetchData: function () {
				var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(_vue) {
					var _pageLoader, navigation, startpagecontent;

					return regeneratorRuntime.wrap(function _callee3$(_context3) {
						while (1) {
							switch (_context3.prev = _context3.next) {
								case 0:
									_context3.next = 2;
									return Loader.LoadData();

								case 2:
									_vue.contentIndex = Loader.ContentIndex;
									_vue.targetIndex = Loader.TargetIndex;

									_pageLoader = new PageLoader();
									_context3.next = 7;
									return _pageLoader.getNavigation();

								case 7:
									navigation = _context3.sent;

									_vue.navigation = navigation;

									_context3.next = 11;
									return _pageLoader.loadMDFile("index");

								case 11:
									startpagecontent = _context3.sent;

									if (typeof startpagecontent === "string" && startpagecontent.length > 0) {
										_vue.maincontent.MainBody = marked(startpagecontent);
									}

									_vue.parseLocationAndNavigate();
									_vue.configLoaded = true;

								case 15:
								case 'end':
									return _context3.stop();
							}
						}
					}, _callee3, this);
				}));

				function fetchData(_x4) {
					return _ref3.apply(this, arguments);
				}

				return fetchData;
			}(),

			parseLocationAndNavigate: function parseLocationAndNavigate() {
				var pagepath = window.location.pathname;
				if (this.isLocalhost) {
					var hash = window.location.hash;
					pagepath = hash.replace("#", "");
				}
				this.loadPage(this, pagepath);
			}
		}
	});
});
