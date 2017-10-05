# DaVanMonet
A Pattern Library system that compiles SASS/LESS to CSS and gives preview of Markdown documentation

## Getting Started
Clone this repository and run the following commands

```shell
npm install
```

or

```shell
yarn install
```

## Configuration
Default configuration resides in patternlibraryconfig.json

### Directories
You can change where the system will put compilated css and where your source files are located

### Index Options
The system will create an index of all the documentation (also used by the preview), this will specify where that index is saved and what metadata to add to the index.

### Compilation
The system can use both less or sass or both.

The option compileIndividualFiles will create one less file per source files. 

### Preview
Settings for the live preview site

### Development Environment
Settings for livereload etc

### Structure
Add folders that should be included in the less/sass/index compilation

### user-conf.json
If a file named user-conf.json exists in the root directory, the values in that file will override the default values in patternlibraryconfig.json.

## On Site Preview
In order to use On Site Preview, onSitePreview.js need to be loaded on the target site, like this:
```html
<script src="http://localhost:9003/static/onSitePreview.js"></script>
```
### Config
Below is an example config snippet for On Site Preview.

The "onsitepreview" object should be at the root level of the configuration tree, preferrably in the user config file (user-conf.json).

```js
"onsitepreview":
{
    "components":
    [
        {
            "guid": "31495b40-9492-40e4-86e3-1e06bfc40171", // Required. GUID of the compontent
            "hook": "#SomeElement > div > p", // Required. Selector at which the component will be injected
            "state": 0, // Optional. State index. 0 will be the first state that is defined. Defaults to 0.
            "inject_pos": "after", // Optional. Specifies where it will be injected in relation to the selector. Before, after, append or prepend. Defaults to after.
            "wrapper": "<p class='preview'></p>", // Optional. The component will be wrapped in this tag if specified.
			"extra_css": ".preview .some-component { position: absolute; width: 100%; }" // Optional. This CSS will be injected in the page in addition to the component.
        }
    ]
}
```

## Usage

### Deployment
```shell
grunt build
```
Copy the build folder that was created

### Development
```shell
grunt previewbuild
```
This will create the css and start a webserver so you can preview your work

## TODO
* Preview should show in an iframe
* 

