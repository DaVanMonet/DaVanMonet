// https://www.npmjs.com/package/schema-object
const SchemaObject = require('schema-object');
const path = require('path');
const SDT = require("./schema-datatypes");

// Component Item State schema
const ComponentItemStateSchema = new SchemaObject(
{
	Language: SDT.NON_EMPTY_STRING,
	Preamble: SDT.OPTIONAL_STRING,
	PreviewMarkup: SDT.NON_EMPTY_STRING,
	RenderSource: SDT.NON_EMPTY_STRING,
	Title: SDT.OPTIONAL_STRING,
	additionalScripts:
	{
		type: Array,
		ArrayType: String
	},
	code: SDT.NON_EMPTY_STRING,
	markdownsource: SDT.NON_EMPTY_STRING,
	parsedcontentm: SDT.NON_EMPTY_STRING
},
{

	// It should not matter which case is used in a config file
	keyIgnoreCase: true,

	methods:
	{

	}

});

module.exports = ComponentItemStateSchema;
