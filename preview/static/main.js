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
	"modules/dataStructureParser",
	"es6-promise",
	"http-vue-loader"], (
		Vue, 
		less, 
		$, 
		marked, 
		highlight, 
		DataStructureParser,
		es6promise,
		httpVueLoader_) =>
{
	
	var afterRender = (href) =>
	{
		$('pre code').each((i, $block) =>
		{
			highlight.highlightBlock($block);
		});

		let $livepreviewAreas = $('[data-livepreview]');
		$livepreviewAreas.each((i, previewarea) =>
		{
			let $previewarea =  $(previewarea);
			// console.log('previewarea',$previewarea)
			let $iframe = $('<iframe src="preview.html?id='+ i +'&path='+ encodeURIComponent(href.replace("#","")) +'"></iframe>');
			$previewarea.after($iframe);
			$previewarea.hide();
		});
	};

	Vue.component('maincontent', {
		template: '#vuetemplate-maincontent',
		props: ['content']
	});

	Vue.component('navigation', {
		template: '#vuetemplate-navigation',
		props: ['navigation', 'sourceDirectory']
	});

	Vue.component('navigation-list', {
		template: '#vuetemplate-navigationlist',
		props: ['items', 'sourceDirectory', 'level'],
		filters:
		{
			// formatFilepathUrl:function(filepath,sourceDirectory)
			// {
			// 	let url = filepath.replace(sourceDirectory,"");
			// 	url = url.replace(".md","");
			// 	return "#" +url;
			// }
		},
		methods:
		{
			onNavigationClick:function(event)
			{
				let href = event.target.attributes.href.value;
				this.$root.loadPage(this,href);
			}
		}
	});

	var app = new Vue({
		el: '#davanmonet-app',
		components:
		{
			'component-showcase-render':httpVueLoader('/components/ComponentShowcaseRender.vue')
		},
		data:
		{
			configLoaded:false,
			navigation:[],
			maincontent:
			{
				title:"Welcome",
				content:"<p>Use the navigation to see the content</p>"
			},
			projectConfig:{},
			indexStructure:{},
			pageLookup:{}
		},
		created: function ()
		{
			this.init(this);

			this.fetchData(this).then(() =>
			{
			});
		},
		methods:
		{
			init: async function(_vue)
			{
				await this.loadConfig(_vue);

				if(_vue.projectConfig.developmentenvironment
					&& _vue.projectConfig.developmentenvironment.livereloadport)
				{
					$('<script src="//localhost:'+ _vue.projectConfig.developmentenvironment.livereloadport +'/livereload.js"></script>')
						.appendTo('body');
				}
			},

			loadPage: async function(_vue,href)
			{
				let _dataStructureParser = new DataStructureParser();
				let pagePath = href.replace("#","");
				let pagedata = await _dataStructureParser.getPage(pagePath);
				
				console.log('returned pagedata', pagedata);

				this.maincontent = pagedata;
				this.$nextTick(() =>
				{
					afterRender(href);
				});

				// let sourcepath = this.projectConfig.directories.src + href.replace("#","") + ".md";
				// fetch(sourcepath).then(res => res.text()).then(filecontent =>
				// {
				// 	//Clean filecontent, remove all content before the second "---"
				// 	var cleanedContent = filecontent.substring(filecontent.substring(3,filecontent.length).indexOf("---")+7,filecontent.length);
					
				// 	window["a"] = filecontent;
				// 	let contentInfo = this.pageLookup[sourcepath];
				// 	let compiledContent = marked(cleanedContent, { sanitize: false });
				// 	this.maincontent.content = compiledContent;
				// 	this.$nextTick(() =>
				// 	{
				// 		afterRender(href);
				// 	});
				// });
			},

			fetchData: async function(_vue)
			{
				await _vue.loadConfig(_vue);
				
				const indexreq = await fetch(_vue.projectConfig.indexing.output);
				const indexStructure = await indexreq.json();
				_vue.indexStructure = indexStructure;

				let _dataStructureParser = new DataStructureParser();
				
				let navigation = await _dataStructureParser.getNavigation();
				_vue.navigation = navigation;
			
				_vue.parseHashAndNavigate();
			},

			loadConfig: async function(_vue) {
				if(_vue.configLoaded)
					return;

				// Load default config
				const configrequest = await fetch('./patternlibraryconfig.json');
				let config = await configrequest.json();
		
				// Look for user config and extend the default config if present
				const userconfigrequest = await fetch(config.userconfig);
				if(userconfigrequest.status !== 404) {
					let userconfig = await userconfigrequest.json();
					$.extend(true, config, userconfig);
				}

				_vue.projectConfig = config;
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