const SDT = require("./schema-datatypes");

// Component Item schema
const ComponentItemSchema = {
  Title: SDT.NON_EMPTY_STRING,
  Content: SDT.NON_EMPTY_STRING,
  id: SDT.REQUIRED_NON_EMPTY_STRING,
  componentid: SDT.NON_EMPTY_STRING,
  private: { type: Boolean, required: false },
  requirejs: SDT.NON_EMPTY_STRING,
  variantid: SDT.NON_EMPTY_STRING
};

module.exports = ComponentItemSchema;
