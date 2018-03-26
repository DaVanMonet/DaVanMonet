// https://www.npmjs.com/package/schema-object
const SchemaObject = require('schema-object');
const path = require('path');
const SDT = require("./schema-datatypes");

// Component Item schema
const ComponentItemSchema = new SchemaObject(
{
	Title: SDT.NON_EMPTY_STRING,
	Content: SDT.NON_EMPTY_STRING,
	id: SDT.REQUIRED_NON_EMPTY_STRING,
	componentid: SDT.NON_EMPTY_STRING,
	private: { type: Boolean, required: false },
	requirejs: SDT.NON_EMPTY_STRING,
	variantid: SDT.NON_EMPTY_STRING
},
{

	// It should not matter which case is used in a config file
	keyIgnoreCase: true,

	methods:
	{

	}

});

module.exports = ComponentItemSchema;
