const NON_EMPTY_STRING = {
  type: "string",
  minLength: 1
};
const OPTIONAL_STRING = {
  type: "string",
  minLength: 0
};
const REQUIRED_NON_EMPTY_STRING = {
  type: NON_EMPTY_STRING,
  required: true
};

module.exports = {
  NON_EMPTY_STRING: NON_EMPTY_STRING,
  OPTIONAL_STRING: OPTIONAL_STRING,
  REQUIRED_NON_EMPTY_STRING: REQUIRED_NON_EMPTY_STRING
};
