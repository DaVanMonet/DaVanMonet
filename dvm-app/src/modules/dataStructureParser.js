//markdown-it-componentpreview.js
// import componentPreviewPlugin from "./markdown-it-componentpreview";
// import mdIframePlugin from "./markdown-it-iframe";
//var md = require('markdown-it')();
//md.use(require("markdown-it-container"), mdIframePlugin.name, mdIframePlugin.config);
//md.use(require("markdown-it-container"), componentPreviewPlugin.name, componentPreviewPlugin.config);
import Loader from '@/src/modules/loader';

export default class DataStructureParser
{
	constructor(configuration = {})
	{
		this._state =
		{
			dataLoaded : false
		};
		this._projectConfig = {};
		this._contentIndex = {};
		this._navigation = [];
		this._indexLookup = {};
		this._navigationLookup = {};
		
		// We match ## as headline for a snipplet
		this.regex =
		{
			findSnipplet : new RegExp("((?:\n## )(.|\w|\W|\r|\n)*?(```$))","gim"),
			findMarkdownH2:  new RegExp("(?:\n## )(.|\r|\n)*?^","gim"),
			findMarkdownCodeblock: new RegExp("(```[A-z]+)(.|\w|\W|\r|\n)*?(```)", "gim")
		};
		
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
			this._contentIndex = Loader.ContentIndex;
			this._state.dataLoaded = true;
		}
	}	

	adjustMarkdownMarkup(markuptext, options =
		{
			removeH1 : true,
			addLanguageClassToPre : true
		})
	{
		let markup = document.createElement('div');
		markup.innerHTML= markuptext;
		if(options.removeH1)
		{
			let arrayH1 = markup.querySelectorAll('h1');
			arrayH1.forEach((h1)=>
			{
				h1.parentNode.removeChild(h1);
			})
		}

		if(options.addLanguageClassToPre)
		{
			let preArray = markup.querySelectorAll('pre');
			preArray.forEach((pre)=>
			{
				const codeClassName = pre.querySelector("code").className;
				pre.className += (codeClassName) ? ' ' + codeClassName : '';
			});
		}

		return markup.innerHTML;
	}

	getCodeSnipplets(markdowntext, variant)
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
					let code = (codeMatch.length > 0) ? codeMatch[0].replace(/(```[A-z]+)/ig,"").replace(/```/ig,"").trim() : "";

					// Fetch comment by removing code and headline
					let parsedContent = md.render(text);
					let markup = document.createElement('div');
					markup.innerHTML = parsedContent;
					let codeTag = markup.querySelectorAll("code");
					let language = "";
					let additionalScripts = [];
					if(codeTag && codeTag[0])
					{
						let codeTagClass = codeTag[0].className.replace("language-",'')
						language = codeTagClass.replace("lang-",'');
					}
					let itemsToRemove = markup.querySelectorAll('h2, h3, h4, pre');
					itemsToRemove.forEach((item) => { item.parentNode.removeChild(item); })

					//Manage different types of frameworks such as Vue, React etc
					if(language.length > 0 && ['vue'].indexOf(language) > -1)
					{
						if(typeof variant[language] !== "undefined")
						{
							additionalScripts = additionalScripts.concat(variant[language]);
						}
					}
					let description = markup.innerHTML;
					let item = 
					{
						Title : headline,
						code : code,	
						PreviewMarkup:code,
						RenderSource:code,
						Preamble: description,
						Language: language,
						parsedcontent : parsedContent,
						markdownsource : text,
						additionalScripts : additionalScripts
					};
					snipplets.push(item);
				}
			});
		}
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
		await this.iterateAndAssignToLookup(this._contentIndex.structure, "_indexLookup", "shortpath");
		return this._indexLookup;
	}

	async createIndexNavigationLookup()
	{
		await this.loadData();
		await this.getNavigation();

		await this.iterateAndAssignToLookup(this._navigation, "_navigationLookup", "href");
		return this._navigationLookup;
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
										variants.push({items:trashVariable, ...itemsByKey[key]});
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

			this._contentIndex.structure.forEach((item,i)  => 
			{
				iterateItem(item, i, result);
			});
			this._navigation = result;
		}

		return this._navigation;
	}
}
