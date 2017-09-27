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

