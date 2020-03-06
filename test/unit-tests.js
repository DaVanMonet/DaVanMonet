const expect = require("chai").expect;
const fs = require("fs-extra");
const load_config = require("../dvm-build/utils/load-config");

describe("Module: load-config.js", function() {
  it("Loads configuration from a YAML or JSON file", function() {
    const dvmConfig = load_config.dvmConfig();
    expect(dvmConfig).to.be.an("object");
  });
});

describe("Module: create-content-index.js", function() {
  const dvmConfig = load_config.dvmConfig();
  const file_path =
    dvmConfig.directories.indexes + "/" + dvmConfig.indexing.contentIndexOutput;

  it("Generates a content index file", function() {
    let create_content_index = require("../dvm-build/utils/create-content-index");

    // Remove old file first if it exists
    if (fs.existsSync(file_path)) fs.unlinkSync(file_path);

    // Temporarily disable console.log
    let consolelogtmp = console.log;
    console.log = msg => {
      /* Nope! */
    };

    // Generate a new content index
    create_content_index();

    // Restore console.log
    console.log = consolelogtmp;

    // Verify that the content index file exists
    let file_exists = fs.existsSync(file_path);
    expect(file_exists).to.be.true;
  });

  it("Confirms to schema", function() {
    // Check file against schema
    let ci_schema = require("./content-index.schema");
    let validate = require("jsonschema").validate;
    let result = validate(JSON.parse(fs.readFileSync(file_path)), ci_schema);
    if (result.errors.length > 0) console.log(result);
    expect(result.errors.length).to.be.equal(0);
  });
});

describe("Module: On Site Preview", function() {
  const requireUncached = require("require-uncached");
  const indexLookup = require("../dvm-build/onsitepreview/inc/indexlookup");

  const dvmConfig = load_config.dvmConfig();
  const contentIndex = requireUncached(
    dvmConfig.indexes_abs() + "/" + dvmConfig.indexing.contentIndexOutput
  );

  describe("indexLookup.js", function() {
    it("Looks up GUID in the contentindex", function() {
      let foundItem = indexLookup.findItemWithGuid(
        contentIndex,
        "button-guid-used-for-testing-dont-change"
      );

      expect(foundItem).to.be.an("object");
      expect(foundItem.filename).to.equal("primary.md");
      expect(foundItem.filepath).to.be.a("string");
      expect(foundItem.shortpath).to.be.a("string");
      expect(foundItem.longpath).to.be.a("string");
      expect(foundItem.type).to.equal("file");
      expect(foundItem.title).to.be.a("string");
      expect(foundItem.guid).to.equal(
        "button-guid-used-for-testing-dont-change"
      );
      expect(foundItem.variantid).to.be.a("string");
      expect(foundItem.componentid).to.be.a("string");
    });
  });

  const snippletsExtractor = require("../dvm-build/onsitepreview/inc/snippletsExtractor");

  describe("snippletsExtractor.js", function() {
    const eol = require("eol");

    it("Extracts markup from a single line component", function() {
      // Find the correct item in the content index
      let foundItem = indexLookup.findItemWithGuid(
        contentIndex,
        "button-guid-used-for-testing-dont-change"
      );

      // Load markdown
      let str = eol.lf(fs.readFileSync(foundItem.longpath, "utf8"));

      // Extract HTML preview snippets
      let codeSnipplets = snippletsExtractor.extractHTMLSnipplets(
        snippletsExtractor.extractVariantMDSnipplets(str)
      );

      let expectedMarkup0 =
        '<button class="button button-primary">Base Button text</button>';
      let expectedMarkup1 =
        '<button class="button button-primary" disabled>Disabled Button</button>';

      expect(codeSnipplets[0]).to.be.equal(expectedMarkup0);
      expect(codeSnipplets[1]).to.be.equal(expectedMarkup1);
    });

    it("Extracts markup from a multi line component", function() {
      // Find the correct item in the content index
      let foundItem = indexLookup.findItemWithGuid(
        contentIndex,
        "example-component-guid-used-for-testing-dont-change"
      );

      // Load markdown
      let str = eol.lf(fs.readFileSync(foundItem.longpath, "utf8"));

      // Extract HTML preview snippets
      let codeSnipplets = snippletsExtractor.extractHTMLSnipplets(
        snippletsExtractor.extractVariantMDSnipplets(str)
      );

      let expectedMarkup0 =
        '<div class="examplecomponent">\n    <h2 class="examplecomponent-headline">Headline for example component</h2>\n</div>';
      let expectedMarkup1 =
        '<div class="examplecomponent">\n    <h2 class="examplecomponent-headline">Second state</h2>\n</div>';

      expect(codeSnipplets[0]).to.be.equal(expectedMarkup0);
      expect(codeSnipplets[1]).to.be.equal(expectedMarkup1);
    });
  });
});
