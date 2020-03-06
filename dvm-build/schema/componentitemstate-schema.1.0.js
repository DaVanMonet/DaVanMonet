const SDT = require("./schema-datatypes");

// Component Item State schema
const ComponentItemStateSchema = {
  Language: SDT.NON_EMPTY_STRING,
  Preamble: SDT.OPTIONAL_STRING,
  PreviewMarkup: SDT.NON_EMPTY_STRING,
  RenderSource: SDT.NON_EMPTY_STRING,
  Title: SDT.OPTIONAL_STRING,
  additionalScripts: {
    type: Array,
    ArrayType: String
  },
  code: SDT.NON_EMPTY_STRING,
  markdownsource: SDT.NON_EMPTY_STRING,
  parsedcontentm: SDT.NON_EMPTY_STRING
};

module.exports = ComponentItemStateSchema;
