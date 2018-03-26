// https://www.npmjs.com/package/schema-object
const SchemaObject = require('schema-object');
const path = require('path');
const SDT = require("./schema-datatypes");
const ComponentItemSchema = require("./componentitem-schema-2.0")

// Page Data schema
const PageDataSchema = new SchemaObject(
{
	id: SDT.REQUIRED_NON_EMPTY_STRING,
    Title: SDT.NON_EMPTY_STRING,
    Preamble: SDT.OPTIONAL_STRING,
    ComponentItems:
    {
        type: Array,
        arrayType:ComponentItemSchema
    }
},
{
	// It should not matter which case is used in a config file
	keyIgnoreCase: true,

	methods:
	{

	}

});

module.exports = PageDataSchema;
