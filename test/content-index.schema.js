module.exports = {
    "definitions": {
        "non_empty_string": {
            "type": "string",
            "minLength": 1
        },
        "ref_to_md_file": {
            "type": "string",
            "minLength": 1,
            "pattern": ".+\.md"
        },
        "ci_file": {
            "type": "object",
            "properties": {
                "filename": { "type": {"$ref": "#/definitions/ref_to_md_file" }},
                "filepath": { "type": {"$ref": "#/definitions/ref_to_md_file" }},
                "shortpath": { "type": {"$ref": "#/definitions/non_empty_string" }},
                "longpath": { "type": {"$ref": "#/definitions/ref_to_md_file" }},
                "type": { "enum": ["file"] },
                "title": { "type": {"$ref": "#/definitions/non_empty_string" }},
                "guid": { "type": {"$ref": "#/definitions/non_empty_string" }},
                "componentid": { "type": {"$ref": "#/definitions/non_empty_string" }}
            },
            "required": ["filename", "filepath", "shortpath", "longpath", "type", "title", "guid", "componentid"]
        },
        "ci_directory": {
            "type": "object",
            "properties": {
                "shortpath": { "type": {"$ref": "#/definitions/non_empty_string" }},
                "longpath": { "type": {"$ref": "#/definitions/non_empty_string" }},
                "type": { "enum": ["directory"] },
                "title": { "type": {"$ref": "#/definitions/non_empty_string" }},
                "filecount": {"type": "number" },
                "directorycount": {"type": "number" },
                "items": {
                    "type": "array",
                    "items": [
                        {
                            "anyOf": [
                                {"$ref": "#/definitions/ci_directory"},
                                {"$ref": "#/definitions/ci_file"}
                            ]
                        }
                    ]
                }
            },
            "required": ["shortpath", "longpath", "type", "title", "filecount", "directorycount", "items"]
        }
    },
    "type": "object",
    "properties": {
        "structure": { 
            "type": "array",
            "items": [
                {
                    "anyOf": [
                        {"$ref": "#/definitions/ci_directory"},
                        {"$ref": "#/definitions/ci_file"}
                    ]
                }
            ]
        }
    }
};