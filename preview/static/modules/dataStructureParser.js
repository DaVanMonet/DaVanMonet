(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(["require", "exports", "marked", "modules/configLoader", "jquery"], factory);
    } else {
        // Browser globals
        root.amdWeb = factory(root.b);
    }
}(this, function (require, exports, marked, ConfigLoader, $) {

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
		
		this.regex = {};
		
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
			this.createRegExs();
		}
	}

	createRegExs()
	{
		if(Object.keys(this.regex).length === 0)
		{
			// Create our regex dependent on configs, if not configured we expect codeblocks to have a '##' headline
			let headlineTargetString = this.isType(this._projectConfig.developmentenvironment.codepreviewheadline,"string") ? this._projectConfig.developmentenvironment.codepreviewheadline : "##";

			this.regex =
			{
				findSnipplet : new RegExp("((?:"+ headlineTargetString +")(.|\w|\W|\r|\n)*?(```$))","gim"),
				findMarkdownH2:  new RegExp("(?:"+ headlineTargetString +")(.|\r|\n)*?^","gim"),
				findMarkdownCodeblock: new RegExp("(```html)(.|\w|\W|\r|\n)*?(```)", "gim")
			};
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
			let snipplets = base.getCodeSnipplets(markdownContent);
			if(snipplets.length > 0)
			{
				variantContent.States = variantContent.States.concat(snipplets);
			}

			// Clean from metadata, (states?) etc.
			let cleanedMarkdown = base.cleanMarkdown(markdownContent, { removeMetadata : true, removeSnipplets : true });

			// Parse what's left from the markdown files
			let parsedMarkdown = marked(cleanedMarkdown, { sanitize: false });

			//Removes H1 etc.
			let adjustedContent = base.adjustMarkdownMarkup(parsedMarkdown);
			variantContent.Content = adjustedContent;
			
			pageData["ComponentItems"].push(variantContent);
		});
			
		return pageData;
	}

	adjustMarkdownMarkup(markuptext, options =
		{
			removeH1 : true
		})
	{
		let markup = document.createElement('div');
		markup.innerHTML= markuptext;
		if(options.removeH1)
		{
			let arrayH1 = markup.querySelectorAll('h1');
			arrayH1.forEach((h1)=>
			{
				console.log('h1', h1);
				h1.parentNode.removeChild(h1);
			})
		}
		return markup.innerHTML;
	}

	getCodeSnipplets(markdowntext)
	{
		let snippletsTexts = this.extractCodeSnipplets(markdowntext);
		let snipplets = [];
		let base = this;
		if(snippletsTexts.length > 0)
		{
			snippletsTexts.forEach((text,i) =>
			{
				if(typeof text === "string" && text.length > 0)
				{
					//Get headline from snipplet text
					let headlineMatch = this.matchFromRegEx(text, base.regex.findMarkdownH2);
					let headline = (headlineMatch.length > 0) ? headlineMatch[0].replace(/#/ig,"").trim() : "";
					
					// Fetch codeblock
					let codeMatch = this.matchFromRegEx(text, base.regex.findMarkdownCodeblock);
					let code = (codeMatch.length > 0) ? codeMatch[0].replace(/```html/ig,"").replace(/```/ig,"").trim() : "";

					// Fetch comment by removing code and headline
					let parsedContent = marked(text);
					let markup = document.createElement('div');
					markup.innerHTML = parsedContent;
					let itemsToRemove = markup.querySelectorAll('h2, h3, h4, pre');
					itemsToRemove.forEach((item) => { item.parentNode.removeChild(item); })
					
					let description = markup.innerHTML;
					let item = 
					{
						Title : headline,
						code : code,	
						PreviewMarkup:code,
						RenderSource:code,
						Preamble: description,
						parsedcontent : parsedContent,
						markdownsource : text
					};
					
					snipplets.push(item);
				}
			});
		}
		console.log(snipplets);
		return snipplets;
	}

	extractCodeSnipplets(markdowntext)
	{
		let snipplets = this.matchFromRegEx(markdowntext,this.regex.findSnipplet);
		return snipplets;
	}

	matchFromRegEx(text, regex)
	{
		let matches = [];
		if(typeof regex !== "undefined")
		{
			const regExGetsnipplet = regex;
			let m;

			while ((m = regExGetsnipplet.exec(text)) !== null)
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
						//Add match to array result
						matches.push(match);
					}
				});
			}
		}
		else
		{
			console.log('Undefined regex');
		}
		return matches;
	}

	async loadMDFile(filepath)
	{
		const fullpath = this._projectConfig.directories.src + "/" + filepath + '.md';
		const filereq = await fetch(fullpath);
		const filecontent = await filereq.text();
		return filecontent;
	}

	cleanMarkdown(markdowntext = "", options = { removeMetadata : true, removeSnipplets : false })
	{
		if(options.removeMetadata === true && markdowntext.indexOf('---') === 0)
		{
			markdowntext = markdowntext.substring(markdowntext.substring(3,markdowntext.length).indexOf("---")+7,markdowntext.length);
		}
		if(options.removeSnipplets === true)
		{
			markdowntext = markdowntext.replace(this.regex.findSnipplet, '');
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