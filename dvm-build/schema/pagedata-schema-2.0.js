const SDT = require("./schema-datatypes");
const ComponentItemSchema = require("./componentitem-schema-2.0");

// Page Data schema
const PageDataSchema = {
  id: SDT.REQUIRED_NON_EMPTY_STRING,
  Title: SDT.NON_EMPTY_STRING,
  Preamble: SDT.OPTIONAL_STRING,
  ComponentItems: {
    type: "array",
    arrayType: ComponentItemSchema
  }
};

module.exports = PageDataSchema;
