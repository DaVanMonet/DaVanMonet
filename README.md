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
### Directories
You can change where the system will put compilated css and where your source files are located

### Index Options
The system will create an index of all the documentation (also used by the preview), this will specify where that index is saved and what metadata to add to the index.

### Compilation
The system can use both less or sass or both.

The option compileIndividualFiles will create one less file per source files. 

### Preview
Settings for the live preview site

### Developmentoptions
Settings for livereload etc

### Structure
Add folders that should be included in the less/sass/index compilation

## Usage
Start the webserver
```shell
grunt startserver
```

## TODO
* Add a development task
* Run server and live reload
* Add page reload support for preview
* Index should contain references to generated css
* Preview should show actual css


