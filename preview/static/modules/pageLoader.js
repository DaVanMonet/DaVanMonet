(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(["require", "exports", "marked", "modules/configLoader", "modules/dataStructureParser"], factory);
    } else {
        // Browser globals
        root.amdWeb = factory(root.b);
    }
}(this, function (require, exports, marked, ConfigLoader, DataStructureParser) {

class PageLoader
{
	constructor(configuration = {})
	{
		this._state =
		{
			dataLoaded : false
		};
		this._projectConfig = {};
		this._index = {};
		this._navigation = [];
		this._indexLookup = {};
		this._navigationLookup = {};
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
			await ConfigLoader.LoadConfig();
			
			this._projectConfig = ConfigLoader.ProjectConfig;
			const indexreq = await fetch(this._projectConfig.indexing.output);
			const index = await indexreq.json();
			this._index = index;
			this._state.dataLoaded = true;
		}
	}

	async getCssTargets()
	{
		var result = [];
		await this.loadData();
		Object.keys(this._projectConfig.compilation.compilers).forEach((compilerKey) =>
		{
			let compilerOptions = this._projectConfig.compilation.compilers[compilerKey];
			if(this.isType(compilerOptions.targets,"object"))
			{
				Object.keys(compilerOptions.targets).forEach((targetKey) =>
				{
					result.push("/" + this._projectConfig.directories.cssdest + "/" + targetKey);
				});
			}
		});
		return result;
	}
	async getPage(href)
	{
		var base = this;
		await this.loadData();
		this._indexLookup = await this.dataStructureParser.createIndexLookup();
		this._navigationLookup = await this.dataStructureParser.createIndexNavigationLookup();
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
				"States":[]
			};
			let filepath = variant["shortpath"];
			
			// Load .md file contents
			let markdownContent = await base.loadMDFile(filepath);
			// Extract code snipplets from markdown
			let snipplets = base.dataStructureParser.getCodeSnipplets(markdownContent);
			if(snipplets.length > 0)
			{
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
			
		return pageData;
	}



	async loadMDFile(filepath)
	{
		const fullpath = this._projectConfig.directories.src + "/" + filepath + '.md';
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