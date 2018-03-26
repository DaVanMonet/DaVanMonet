// https://www.npmjs.com/package/schema-object
const SchemaObject = require('schema-object');

const NON_EMPTY_STRING = {
	type: String,
	minLength: 1
};
const OPTIONAL_STRING = {
	type: String,
	minLength: 0
};
const REQUIRED_NON_EMPTY_STRING = {
	type: NON_EMPTY_STRING,
	required: true
}

module.exports = 
{
	NON_EMPTY_STRING:NON_EMPTY_STRING,
	OPTIONAL_STRING:OPTIONAL_STRING,
	REQUIRED_NON_EMPTY_STRING:REQUIRED_NON_EMPTY_STRING
};
