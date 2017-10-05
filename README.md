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

### On Site Preview
Below is an example config snippet for On Site Preview.

Guid selects which compontent, state selects state index, and inject_at is the CSS-selector after which the markup is injected on the site.

The "onsitepreview" object should be at the root level of the configuration tree, preferrably in the user config file (user-conf.json).

```json
"onsitepreview":
{
    "components":
    [
        {
            "guid": "31495b40-9492-40e4-86e3-1e06bfc40171",
            "state": 0,
            "inject_at": "#OuterRegion_WideWidgetArea1_EPiPropertyControl_ctl00_ctl04_ctl00_PanelContent > div.contentwrap.eighteen > div > p"
        }
    ]
}
```

### user-conf.json
If a file named user-conf.json exists in the root directory, the values in that file will override the default values in patternlibraryconfig.json.


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

