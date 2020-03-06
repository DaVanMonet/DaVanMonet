const SDT = require("./schema-datatypes");
const StateItemSchema = require("./componentitemstate-schema.1.0");

// Component Item schema
const ComponentItemSchema = {
  Title: SDT.NON_EMPTY_STRING,
  Content: SDT.NON_EMPTY_STRING,
  id: SDT.REQUIRED_NON_EMPTY_STRING,
  componentid: SDT.NON_EMPTY_STRING,
  private: { type: "boolean", required: false },
  requirejs: SDT.NON_EMPTY_STRING,
  variantid: SDT.NON_EMPTY_STRING,
  States: {
    type: "array",
    arrayType: StateItemSchema
  }
};

module.exports = ComponentItemSchema;
