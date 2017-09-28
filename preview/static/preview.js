require.config({
	paths:
	{
		'lodash':'/lib/lodash@4.16.0/lodash',
		'marked':'/lib/marked@0.3.6/marked',
		'jquery':'/lib/jquery@3.2.1/jquery.min'
	}
});

define(["jquery","marked","modules/parsequery"], ($, marked, parsequery) =>
{
	(async () =>
	{
		await ConfigLoader.LoadConfig();
		let config = ConfigLoader.ProjectConfig;
		
		if(config.developmentenvironment && config.developmentenvironment.livereloadport)
		{
			$('<script src="//localhost:'+ config.developmentenvironment.livereloadport +'/livereload.js"></script>').appendTo('body');
		}
		let querydata =  parsequery(window.location.href);
		let pageData = loadPage(querydata["href"]);
		
	})();

	function loadPage(href)
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
	};
});
