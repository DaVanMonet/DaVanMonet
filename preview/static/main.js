require.config({
	paths:
	{
		'vue':'/lib/vue@2.4.2/vue',
		'lodash':'/lib/lodash@4.16.0/lodash',
		'marked':'/lib/marked@0.3.6/marked',
		'highlight':'/lib/highlight.js@9.12.0/highlight.min',
		'jquery':'/lib/jquery@3.2.1/jquery.min',
		'less':'/lib/less@2.7.2/less.min',
		'es6-promise':'/lib/es6-promise@4.1.1/es6-promise.auto.min',
		'http-vue-loader':'/lib/http-vue-loader@1.3.3/httpVueLoader'
	}
});

define([
	"vue",
	"less",
	"jquery",
	"marked",
	"highlight",
	"modules/pageLoader",
	"modules/loader",
	"es6-promise",
	"http-vue-loader"], (
		Vue, 
		less, 
		$, 
		marked, 
		highlight, 
		PageLoader,
		Loader,
		es6promise,
		httpVueLoader_) =>
{
	window["highlight"] = highlight;
	var afterRender = (href) =>
	{
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
		components:
		[
			"url:/vuecomponents/component/ComponentShowcaseCsslinks.vue",
			"url:/vuecomponents/component/ComponentShowcaseRender.vue",
			"url:/vuecomponents/Maincontent.vue",
			"url:/vuecomponents/Navigation.vue"
		],
		data:
		{
			configLoaded:false,
			navigation:[],
			maincontent:
			{
				Title:null,
				Preamble:null,
				MainBody:"<p>This project does not yet have a startpage. Create a index.md file in the root folder of your style source</p>"
			},
			projectConfig:{},
			contentIndex:{},
			targetIndex:{},
			pageLookup:{}
		},
		created: function ()
		{
			this.init(this);
		},
		methods:
		{
			init: async function(_vue)
			{
				await Loader.LoadData();
				
				_vue.projectConfig = Loader.ProjectConfig;

				if(_vue.projectConfig.developmentenvironment && _vue.projectConfig.developmentenvironment.livereloadport)
				{
					$('<script src="//localhost:'+ _vue.projectConfig.developmentenvironment.livereloadport +'/livereload.js"></script>')
						.appendTo('body');
				}

				this.fetchData(this).then(() =>
				{
				});

				

				// Rudimentary themeing support
				if(_vue.projectConfig.project_info.theme_style !== "default") {
					$('head').append('<link rel="stylesheet" type="text/css" href="' + _vue.projectConfig.project_info.theme_style + '" />');
				}
				$(".davanmonet-header-nav-link").text(_vue.projectConfig.project_info.name);
				$(".davanmonet-header-logo").attr('src', _vue.projectConfig.project_info.logo);
			},

			loadPage: async function(_vue,href)
			{
				const _pageLoader = new PageLoader();
				const pagePath = href.replace("#","");
				const pagedata = await _pageLoader.getPage(pagePath);
				
				this.maincontent = pagedata;
				this.$nextTick(() =>
				{
					afterRender(href);
				});	
			},

			fetchData: async function(_vue)
			{	
				await Loader.LoadData();
				_vue.contentIndex = Loader.ContentIndex;
				_vue.targetIndex = Loader.TargetIndex;
				
				const _pageLoader = new PageLoader();
				const navigation = await _pageLoader.getNavigation();
				_vue.navigation = navigation;


				const startpagecontent = await _pageLoader.loadMDFile("index");
				if(typeof startpagecontent === "string" && startpagecontent.length > 0)
				{
					_vue.maincontent.MainBody = marked(startpagecontent);
				}
				

				_vue.parseHashAndNavigate();
				_vue.configLoaded = true;
			},

			parseHashAndNavigate: function()
			{
				const hash = window.location.hash;
				if(hash.indexOf("#/") !== -1)
				{
					this.loadPage(this, hash);
				}
			}
		}
	});
});