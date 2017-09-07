

require.config({
	paths:
	{
		'vue':'lib/vue@2.4.2/vue',
		'lodash':'lib/lodash@4.16.0/lodash',
		'marked':'lib/marked@0.3.6/marked',
		'gray-matter':'lib/gray-matter@3.0.0/index',
		'highlight':'lib/highlight.js@9.12.0/highlight.min',
		'jquery':'lib/jquery@3.2.1/jquery.min',
	}
});


define(["vue","jquery","lodash","marked","highlight"], (Vue, $, _, marked, highlight) =>
{

	Vue.component('maincontent', {
		template: '#vuetemplate-maincontent',
		props: ['content']
	});
	Vue.component('navigation', {
		template: '#vuetemplate-navigation',
		props: ['navigation', 'sourceDirectory'],
		filters:
		{
			formatFilepathUrl:function(filepath,sourceDirectory)
			{
				let url = filepath.replace(sourceDirectory,"");
				url = url.replace(".md","");
				return "#" +url;
			}
		},
		methods:
		{
			onPageClick:function(event)
			{
				let href = event.target.attributes.href.value;
				this.$parent.loadPage(href);
			}
		}
	});

	var app = new Vue({
		el: '#app',
		data:
		{
			configLoaded:false,
			navigation:
			{
				items:
				[
					{
						name:"Introduction",
						href:"/",
						type:"link"
					}
				]
			},
			maincontent:
			{
				content:"<h1 class='preview-h1'>Welcome</h1><p class='preview-intro-p'>Use the navigation to see the content</p>"
			},
			projectConfig:{},
			indexData:{},
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
				console.log('href', href)
				console.log('sourcepath',sourcepath )
				fetch(sourcepath).then(res => res.text()).then(filecontent =>
				{
					//Clean filecontent, remove all content before the second "---"
					var cleanedContent = filecontent.substring(filecontent.substring(3,filecontent.length).indexOf("---")+3,filecontent.length);

					//console.log(filecontent);

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
					fetch(config.indexingOptions.output).then(res => res.json()).then(indexdata =>
					{
						this.projectConfig = config;
						this.indexData = indexdata;
						// console.log('config',config)
						// console.log('indexdata',indexdata)
						// console.log('this',this)
						this.parseIndexForNavigation();
						this.configLoaded = true;
					});
				});
			},
			parseIndexForNavigation:function()
			{
				this.indexData.structure.forEach((directory) =>
				{
					if(directory.count > 0)
					{
						this.navigation.items.push(
						{
							"name": directory.title + " ("+ directory.count +")",
							"type":"directory",
						});
					}
					directory.items.forEach((item) =>
					{
						this.pageLookup[item.filepath] = {
							"name": item.title,
							"type":"page",
							"guid":item.guid,
							"filepath":item.filepath,
							"filename":item.filename
						};
						this.navigation.items.push(
							{
								"name": item.title,
								"type":"page",
								"guid":item.guid,
								"filepath":item.filepath,
								"filename":item.filename
							});
					});
				});
			}
		}
	  });
	});
