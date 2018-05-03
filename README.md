# DaVanMonet
A Pattern Library system that compiles SASS/LESS to CSS and gives preview of Markdown documentation

## Getting Started
You can use this project in two ways, either clone the repository and work in it directly, or use it as a grunt task.

### Clone
Clone this repository and run the following commands in the base directory (we use npm as an example but recommend you use [yarn](https://yarnpkg.com/en/))

#### Using NPM
```shell
npm install
```

### Install DvM as a package
#### Installation
```shell
npm install davanmonet --save-dev
```
#### Configuration
In your package.json
```js
"config": {
    "configFile": "./configs/projectoptions.yml"
},
```

#### Run as NPM scripts
In your package.json
```js
"scripts": {
    "dev": "node node_modules/davanmonet/dvm-build/dev-server.js"
  },
```

Then simply start the project in development mode:
```shell
npm run dev
```

## Writing documentation
Documentation is written in [Markdown](https://daringfireball.net/projects/markdown/). 
A page visible on the website can consist of multiple markdown files. They will be automatically combined if they have the same component id (See primary.md and secondary.md in the button folder).

To create a component preview, wrap a code segment with _:::componentpreview_
If a component has multiple states just add more code segments with a headline above the code to name the state. See the example documentation in this project

## Iframes
In some cases, the built-in preview frame might not work for you. In that case you can create a static HTML-file instead, and display it using an iframe. Use this markdown to cerate an iframe: _:::iframe(url/to/your-file.html)_

If you include the client script for [iFrame Resizer](https://github.com/davidjbradshaw/iframe-resizer) in the document in the iframe, it will automatically resize itself to fit the content. You can also specify the height in the markdown, like this: _:::iframe(url/to/your-file.html,600)_. Width will always be 100%.

## Configuration file (JSON or YAML)
Default configuration resides in /configs/projectoptions.yml
It can be a JSON file as well. Just specify the correct path to the options file in your gruntfile configuration.


### Directories
You can change where the system will put compiled css and where your source files are located

### Index Options
The system will create an index of all the documentation (also used by the preview), this will specify where that index is saved and what metadata to add to the index.

For keys to index we recommend relying only on strings. If a index key is not present in the documentation metadata it will not be included per documentation file.

The one exception of this is the key "private". If it is present in the configuration we will always cast it to a boolean.

### Compilation
Add target files here. These can be anything that Webpack can understand. By default Less, Sass and JS (es6) is supported, but you can add more loaders to Webbpack for other languages.

The option compileIndividualFiles will create one less file per source files. 

### Env
Settings for ports etc

### Structure
Add folders that should be included in the less/sass/index compilation.
If this is left empty, all folders in your specified src directory will be included.

### User configuration (JSON or YAML)
The options "userconfig" takes a string with a path to additional configuration for a specific user. This file should not be checked in. And the application will run even if the file is not present.
The content of the file will extend the existing options for the project. 
This makes it possible for developers to choose which port to run the dev environment on

## On Site Preview
In order to use On Site Preview, onSitePreview.js need to be loaded on the target site, like this:
```html
<script src="http://localhost:9001/ospClient.js"></script>
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
npm run build
```
Compiles the project into the Dist folder. The build will generate three folders. 
1. *Indexes* contains information about what documentation is contained in the project
2. *Package* contains the compiled css and the source ready to be published as a npm package
3. *Web* contains everything you need to deploy a pattern library website on IIS (or Apache).

### Development
```shell
npm run dev
```
This will create the css and start a webserver so you can preview your work
