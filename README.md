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

### Grunt task
#### Installation
```shell
npm install github:wezz/davanmonet --save-dev
```
#### Configuration
In your grunt configuration
```js
davanmonet:
{
    options:
    {
        "config":"./configs/projectoptions.json"	
    }
}
```

#### Run tasks
```js
grunt.loadNpmTasks("davanmonet");

grunt.registerTask("createindexes", ["davanmonet:createindexes"]);
grunt.registerTask("build", ["davanmonet:build"]);
grunt.registerTask("dev", ["davanmonet:dev"]);
```

## Configuration file (JSON or YAML)
Default configuration resides in /configs/projectoptions.yml
It can be a JSON file as well. Just specify the correct path to the options file in your gruntfile configuration.


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
Add folders that should be included in the less/sass/index compilation.
If this is left empty, all folders in your specified src directory will be included.

### User configuration (JSON or YAML)
The options "userconfig" takes a string with a path to additional configuration for a specific user. This file should not be checked in. And the application will run even if the file is not present.
The content of the file will extend the existing options for the project. 
This makes it possible for developers to choose which port to run the dev environment on

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

## Grunt tasks

### Deployment
```shell
grunt davanmonet:build
```
Compiles the css and copies the required assets over to the build folder, the content of the build folder is ready to be hosted on a IIS website.

### Development
```shell
grunt davanmonet:dev
```
This will create the css and start a webserver so you can preview your work

### Create indexes
```shell
grunt davanmonet:createindexes
```
This is used in the previous steps. It creates the content (documentation) and the target (outputed css) indexes.