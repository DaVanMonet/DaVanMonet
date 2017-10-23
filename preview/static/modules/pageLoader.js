(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(["require", "exports", "marked", "modules/loader", "modules/dataStructureParser"], factory);
    } else {
        // Browser globals
        root.amdWeb = factory(root.b);
    }
}(this, function (require, exports, marked, Loader, DataStructureParser) {

class PageLoader
{
	constructor(configuration = {})
	{
		this._state =
		{
			dataLoaded : false
		};
		this._projectConfig = {};
		this._contentindex = {};
		this._navigation = [];
		this._indexLookup = {};
		this._navigationLookup = {};
		this._targetindex = {};
		this.dataStructureParser = new DataStructureParser();
		
		this._configuration = {
			"sourceDirectory" : "",
			"groupNavigationalItemsByKey":""
		};
		Object.assign(this._configuration, configuration);
	}

	isType(val, type)
	{
		return (typeof val === type && (type !== "string" || (type === "string" && val.length > 0)));
	}

	async loadData()
	{
		if(this._state.dataLoaded === false)
		{
			await Loader.LoadData();
			
			this._projectConfig = Loader.ProjectConfig;
			this._contentindex = Loader.ContentIndex;
			this._targetindex = Loader.TargetIndex;
			
			this._indexLookup = await this.dataStructureParser.createIndexLookup();
			this._navigationLookup = await this.dataStructureParser.createIndexNavigationLookup();
		
			this._state.dataLoaded = true;
		}
	}

	async getPage(href)
	{
		var base = this;
		await this.loadData();
		
		if(href.indexOf('/') === 0)
		{
			href = href.substr(1);
		}
		let indexData = this._indexLookup[href];
		let navigationalData = this._navigationLookup[href];

		let pageData =
		{
			"id":"",
			"Title":"",
			"Preamble":"",
			"ComponentItems":[],
		};
		
		//When theres is a file matching and no "variants" are present.
		pageData.id = indexData["guid"];
		pageData.Title = indexData["title"];
		

		var variants = [];
		// Structure only contains one file.
		if(indexData["type"] === "file")
		{
			variants.push(indexData);
		}
		else if(typeof navigationalData["variants"] === "object" && navigationalData["variants"].length > 0)
		{
			let matchOnKey = "guid";
			let variantIds = navigationalData["variants"].map(x => x[matchOnKey]);
			variants = indexData["items"].filter(x => variantIds.indexOf(x[matchOnKey]) !== -1);
		}
		//This variable is what we use to match a the MD files with what is contained in the navigational structure
		pageData.id = navigationalData["guid"];
		pageData.title = navigationalData["title"];
		
		await variants.forEach(async (variant, i) =>
		{
			let variantContent =
			{
				"id":variant["guid"],
				"componentid":variant["componentid"],
				"variantid":variant["variantid"],
				"Title":variant["title"],
				"Content":"",
				"States":[],
				"requirejs":""
			};
			let filepath = variant["shortpath"];

			
			// Load .md file contents
			let markdownContent = await base.loadMDFile(filepath);
			// Extract code snipplets from markdown
			let snipplets = base.dataStructureParser.getCodeSnipplets(markdownContent);
			if(snipplets.length > 0)
			{
				//Add additional information to each state (Set by the indexing metadata)
				if(typeof variant["requirejs"] === "string")
				{
					snipplets.forEach(snipplet => snipplet["requirejs"] = variant["requirejs"])
				}
				
				variantContent.States = variantContent.States.concat(snipplets);
			}

			// Clean from metadata, (states?) etc.
			let cleanedMarkdown = base.dataStructureParser.cleanMarkdown(markdownContent, { removeMetadata : true, removeSnipplets : true });

			// Parse what's left from the markdown files
			let parsedMarkdown = marked(cleanedMarkdown, { sanitize: false });

			//Removes H1 etc.
			let adjustedContent = base.dataStructureParser.adjustMarkdownMarkup(parsedMarkdown);
			variantContent.Content = adjustedContent;
			
			pageData["ComponentItems"].push(variantContent);
		});
		console.log('pageData',pageData)
		return pageData;
		
	}



	async loadMDFile(filepath)
	{
		await this.loadData();
		const requestbase = "//" + window.location.host + "/";
		const fullpath = requestbase + this._projectConfig.directories.src + "/" + filepath + '.md';
		const filereq = await fetch(fullpath);
		const filecontent = await filereq.text();
		return filecontent;
	}

	async getNavigation()
	{
		this._navigation = await this.dataStructureParser.getNavigation();
		return this._navigation;
	}
}


return PageLoader;
}));