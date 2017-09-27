(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(["require", "exports", "marked", "jquery"], factory);
    } else {
        // Browser globals
        root.amdWeb = factory(root.b);
    }
}(this, function (require, exports, marked, $) {

class DataStructureParser
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

		this._configuration = {
			"sourceDirectory" : "",
			"groupNavigationalItemsByKey":""
		};
		Object.assign(this._configuration, configuration);
	}

	async loadData()
	{
		if(this._state.dataLoaded === false)
		{
			const configreq = await fetch('./patternlibraryconfig.json');
			const config = await configreq.json();

			// Look for user config and extend the default config if present
			// TODO: Come up with a better way to load config, so that this code does not need to be repeated in multiple places
			const userconfigrequest = await fetch(config.userconfig);
			if(userconfigrequest.status !== 404) {
				let userconfig = await userconfigrequest.json();
				$.extend(true, config, userconfig);
			}
			
			this._projectConfig = config;
			const indexreq = await fetch(this._projectConfig.indexing.output);
			const index = await indexreq.json();
			this._index = index;
			this._state.dataLoaded = true;
		}
	}

	async getPage(href)
	{
		var base = this;
		await this.loadData();
		await this.createIndexLookup();
		await this.createIndexNavigationLookup();
		if(href.indexOf('/') === 0)
		{
			href = href.substr(1);
		}
		
		let indexData = this._indexLookup[href];
		let navigationalData = this._navigationLookup[href];
		let pageData =
		{
			"id":"",
			"title":"",
			"content":"",
			"sections":[]
		};
		if(indexData["type"] === "file")
		{
			//When theres is a file matching and no "variants" are present.
			pageData.id = indexData["guid"];
			pageData.title = indexData["title"];
			let filepath = indexData["shortpath"];
			
			// Load .md file contents
			let markdownContent = await base.loadMDFile(filepath);
			// Extract code snipplets from markdown
			let snipplets = base.extractCodeSnipplets(markdownContent);
			// Clean from metadata, (states?) etc.
			let cleanedMarkdown = base.cleanMarkdown(markdownContent, { removeMetadata : true, snipplets : true });
			// Parse what's left from the markdown files
			let parsedMarkdown = marked(cleanedMarkdown, { sanitize: false });
			//Removes H1 etc.
			let adjustedContent = base.adjustMarkdownMarkup(parsedMarkdown);
			
			pageData.content = adjustedContent;
		}
		else
		{
			if(typeof navigationalData["variants"] === "object" && navigationalData["variants"].length > 0)
			{
				//This variable is what we use to match a the MD files with what is contained in the navigational structure

				let matchOnKey = "guid";
				pageData.id = navigationalData["guid"];
				pageData.title = navigationalData["title"];
				let variantIds = navigationalData["variants"].map(x => x[matchOnKey]);
				let variants = indexData["items"].filter(x => variantIds.indexOf(x[matchOnKey]) !== -1);
				await variants.forEach(async (variant, i) =>
				{
					let variantContent =
					{
						"id":variant["guid"],
						"componentid":variant["componentid"],
						"variantid":variant["variantid"],
						"title":variant["title"],
						"content":"",
						"states":[]
					};
					let filepath = variant["shortpath"];

					// Load .md file contents
					let markdownContent = await base.loadMDFile(filepath);
					// Extract code snipplets from markdown
					let snipplets = base.extractCodeSnipplets(markdownContent);
					// Clean from metadata, (states?) etc.
					let cleanedMarkdown = base.cleanMarkdown(markdownContent, { removeMetadata : true, snipplets : true });
					// Parse what's left from the markdown files
					let parsedMarkdown = marked(cleanedMarkdown, { sanitize: false });
					//Removes H1 etc.
					let adjustedContent = base.adjustMarkdownMarkup(parsedMarkdown);

					variantContent.content = adjustedContent;
					
					pageData["sections"].push(variantContent);
				});
			}
		}
		return pageData;
	}

	adjustMarkdownMarkup(markup, options =
		{
			removeH1 : true
		})
	{
		let $markup = $('<div></div>').html(markup);
		if(options.removeH1)
		{
			// console.log('markup',markup)
			// console.log($markup.find('h1').eq(0))
			$markup.find('h1').eq(0).remove();
		}
		return $markup.html();
	}

	extractCodeSnipplets(markdowntext)
	{
		let snipplets = [];
		const regExGetsnipplet = /((?:##)(.|\w|\W|\r|\n)*?(```$))/gim;
		let m;

		while ((m = regExGetsnipplet.exec(markdowntext)) !== null)
		{
			// This is necessary to avoid infinite loops with zero-width matches
			if (m.index === regExGetsnipplet.lastIndex)
			{
				regExGetsnipplet.lastIndex++;
			}
			
			// The result can be accessed through the `m`-variable.
			m.forEach((match, groupIndex) =>
			{
				if(groupIndex === 0)
				{
					let snipplet =
					{
						content:match
					};
					snipplets.push(snipplet);
				}
				//console.log(`Found match, group ${groupIndex}: ${match}`);
			});
		}
console.log('snipplets', snipplets)

		return snipplets;
	}

	async loadMDFile(filepath)
	{
		const fullpath = this._projectConfig.directories.src + "/" + filepath + '.md';
		const filereq = await fetch(fullpath);
		const filecontent = await filereq.text();
		//const cleanedcontent = 
		//const parsedcontent = marked(cleanedcontent, { sanitize: false });

		return filecontent;
	}

	cleanMarkdown(markdowntext = "", options = { removeMetadata : true })
	{
		if(options.removeMetadata === true && markdowntext.indexOf('---') === 0)
		{
			markdowntext = markdowntext.substring(markdowntext.substring(3,markdowntext.length).indexOf("---")+7,markdowntext.length);
		}
		return markdowntext;
	}

	async createIndexLookup()
	{
		await this.loadData();
		await this.iterateAndAssignToLookup(this._index.structure, "_indexLookup", "shortpath");
	}

	async createIndexNavigationLookup()
	{
		await this.loadData();
		await this.getNavigation();

		await this.iterateAndAssignToLookup(this._navigation, "_navigationLookup", "href");
	}

	async iterateAndAssignToLookup(data, lookupObjKey, qualifyKey = "shortpath", childKey = "items")
	{
		if(typeof data === "object" && data.length !== 0 && Object.keys(this[lookupObjKey]).length === 0)
		{
			let iterateItem = (item, i) =>
			{
				// Assign to lookup table
				(typeof item[qualifyKey] === "string") ? this[lookupObjKey][item[qualifyKey]] = item : 1;
				// Iterate children
				(typeof item[childKey] === "object" && item[childKey].length !== 0) ? item[childKey].forEach(iterateItem.bind(this)) : 1;
			};
			data.forEach(iterateItem.bind(this));
		}
	}

	async getNavigation()
	{
		await this.loadData();
		if(this._navigation.length === 0)
		{
			let uniqueKey = this._configuration.groupNavigationalItemsByKey;
			if(uniqueKey.length === 0)
			{
				uniqueKey = "componentid";
			}
			let result = [],
				iterateItem = (item, i, parentArray) =>
				{
					let resultItem = 
					{
						"title": item["title"],
						"guid": item["guid"],
						"variantid": item["variantid"],
						"componentid": item["componentid"]
					},
					childitems = [];
					if(item["type"] === "file")
					{
						resultItem["href"] = item["shortpath"];
					}
					if(typeof item[uniqueKey] !== "undefined")
					{
						resultItem[uniqueKey] = item[uniqueKey];
					}
					
					if(typeof item["items"] === "object" && item["items"].length > 0)
					{
						item["items"].forEach((childItem, j, resultItem) =>
						{
							iterateItem(childItem, j, childitems)
						});
						
						if(childitems.length > 0)
						{
							let itemsByKey = {};
							//Loop through the items and check if there already exists a item with the same unique key
							childitems.forEach((childitem, k) =>
							{
								let key = (typeof childitem[uniqueKey] === "string") ? childitem[uniqueKey] : "itemkey"+k;
								if(typeof itemsByKey[key] === "undefined")
								{
									itemsByKey[key] = childitem;
								}
								else
								{
									//We found another item with the same unique key value
									//Set the parent items title and reduce the path with one
									let hasVariants = (typeof itemsByKey[key]["variants"] !== "undefined")
									let variants = hasVariants ? itemsByKey[key]["variants"] : [];
									let trashVariable;
									if(!hasVariants)
									{	
										variants.push({items:trashVariable,...itemsByKey[key]});
									}
									variants.push({items:trashVariable,...childitem});
									
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
							for(let key in itemsByKey)
							{
								childitems.push(itemsByKey[key]);
							}
						}
						resultItem["items"] = childitems;
					}
					parentArray.push(resultItem);
				};

			this._index.structure.forEach((item,i)  => 
			{
				iterateItem(item, i, result);
			});
			this._navigation = result;
		}

		return this._navigation;
	}
}


return DataStructureParser;
}));