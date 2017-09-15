require.config({
	paths:
	{
		'vue':'/lib/vue@2.4.2/vue',
		'lodash':'/lib/lodash@4.16.0/lodash',
		'marked':'/lib/marked@0.3.6/marked',
		'gray-matter':'/lib/gray-matter@3.0.0/index',
		'highlight':'/lib/highlight.js@9.12.0/highlight.min',
		'jquery':'/lib/jquery@3.2.1/jquery.min',
		'less':'/lib/less@2.7.2/less.min',
	}
});

define(["vue","less","jquery","marked","highlight"], (Vue,less, $, marked, highlight) =>
{
	(async () =>
	{
		const configrequest = await fetch('./patternlibraryconfig.json');
		let config = await configrequest.json();
		
		if(config.developmentenvironment && config.developmentenvironment.livereloadport)
		{
			$('<script src="//localhost:'+ config.developmentenvironment.livereloadport +'/livereload.js"></script>').appendTo('body');
		}
	})();


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
			onPageClick:function(event)
			{
				let href = event.target.attributes.href.value;
				this.$root.loadPage(href);
			}
		}
	});

	var app = new Vue({
		el: '#davanmonet-app',
		data:
		{
			configLoaded:false,
			navigation:
			{
				items:[]
			},
			maincontent:
			{
				content:"<h1 class='preview-h1'>Welcome</h1><p class='preview-intro-p'>Use the navigation to see the content</p>"
			},
			projectConfig:{},
			indexStructure:{},
			pageLookup:{}
		},
		created: function ()
		{
			this.fetchData();
		},
		methods:
		{
			loadPage:function(href)
			{
				let sourcepath = this.projectConfig.directories.src + href.replace("#","") + ".md";
				fetch(sourcepath).then(res => res.text()).then(filecontent =>
				{
					//Clean filecontent, remove all content before the second "---"
					var cleanedContent = filecontent.substring(filecontent.substring(3,filecontent.length).indexOf("---")+7,filecontent.length);
					
					//console.log(cleanedContent);

					window["a"] = filecontent;
					let contentInfo = this.pageLookup[sourcepath];
					let compiledContent = marked(cleanedContent, { sanitize: false });
					this.maincontent.content = compiledContent;
					this.$nextTick(() =>
					{
						$('pre code').each((i, block) =>
						{
							highlight.highlightBlock(block);
						});
					});
				});
			},
			fetchData: function()
			{
				fetch('./patternlibraryconfig.json').then(res => res.json()).then(config =>
				{
					fetch(config.indexing.output).then(res => res.json()).then(indexStructure =>
					{
						this.projectConfig = config;
						this.indexStructure = indexStructure;
						this.parseIndexForNavigation();
						this.configLoaded = true;
					});
				});
			},
			parseIndexForNavigation:function()
			{
				const hash = window.location.hash;
				if(hash.indexOf("#/") !== -1)
				{
					this.loadPage(hash);
				}
			}
		}
	  });
	});
