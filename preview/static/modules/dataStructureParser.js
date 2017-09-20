(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([''], factory);
    } else {
        // Browser globals
        root.amdWeb = factory(root.b);
    }
}(this, function () {


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
			
			this._projectConfig = config;
			const indexreq = await fetch(this._projectConfig.indexing.output);
			const index = await indexreq.json();
			this._index = index;
			this._state.dataLoaded = true;
		}
	}

	async getPage(href)
	{
		await this.loadData();
		await this.createIndexLookup();
		await this.createIndexNavigationLookup();
		if(href.indexOf('/') === 0)
		{
			href = href.substr(1);
		}
		console.log('getPage this._indexLookup[href]',this._indexLookup[href])
		
		console.log('getPage this._navigationLookup[href]',this._navigationLookup[href])
		let indexData = this._indexLookup[href];
		let navigationalData = this._navigationLookup[href];
		if(indexData["type"] === "file")
		{
			console.log('found one file, time to load it');
		}
		else
		{
			if(typeof navigationalData["variants"] === "object" && navigationalData["variants"].length > 0)
			{
				console.log('found ' + navigationalData["variants"].length + ' variants', navigationalData["variants"]);
			}
		}
		


		// 	let contentInfo = this.pageLookup[sourcepath];
		// 	let compiledContent = marked(cleanedContent, { sanitize: false });
		// 	this.maincontent.content = compiledContent;
		return "TODO: parse stuff";
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
										// console.log('first key I think', itemsByKey[key])
										//variants.push(itemsByKey[key]);
										
										variants.push({items:trashVariable,...itemsByKey[key]});
										
									}
									variants.push({items:trashVariable,...childitem});
									//variants.push(childitem);
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

		//console.log(JSON.stringify({"items":this._navigation}));
		return this._navigation;
	}
}


return DataStructureParser;
}));