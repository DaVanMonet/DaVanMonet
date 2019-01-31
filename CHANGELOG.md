# Changelog

## [1.4.1] - 2019-01-31
### Added
- Bug fix for navigation when hosting on GH pages

## [1.4.0] - 2019-01-31
### Added
- Updated handling of paths, in order to make DvM compatible with GitHub pages.

## [1.3.6] - 2019-01-21
### Added
- Updated dependencies. Might contain things that doesn't work. Not yet upgraded to webpack 4.

## [1.1.17] - 2018-03-27
### Added
- Replaced Marked with markdown-it
- Changed how we show preview components

## [1.1.16] - 2018-03-23
### Added
- Added meta viewport and removed body margin on standalone component preview

## [1.1.15] - 2018-03-22
### Added
- Added component path to iframe URL, updated targetindex script to generate correct paths for other files than CSS
- Fixed problem with angular and attributes

## [1.1.13] - 2018-03-13

### Fixed
- Fixed error message from Vue

## [1.1.12] - 2018-03-13

### Added
- Better documentation for On Site Preview functionality

### Fixed
- Code highlighting wasn't styled
- We now hide the version info when the menu is closed


## [1.1.11] - 2018-02-13

### Added
- Support for preview of Vue components
- Expanded support for rendering of different types of content (such as react & angular). Requires additional configuration (See PatternLibraryExample)

### Fixed
- Fixed bug with being unable to load pages that have a space in the parent folder or filename.

## [1.1.9] - 2018-01-22

### Fixed
- Fixed bug with the wrong version file not loading on subpages

## [1.1.8] - 2018-01-22

### Fixed
- Fixed bug with the wrong versions being shown on below navigation

## [1.1.7] - 2018-01-22

### Added
- Added current version of project and DaVanMonet under the navigation

### Fixed
- Fixed bug with pages that has multiple components did not load as intended

## [1.1.6] - 2018-01-16

### Added
- Navigation now has a toggle 

### Changed
- Changed repository icon
- RegExp for matching code snipplets has improved matching abilities.
- Accessibility documentation update
- Removed unnecessary documentation

### Fixed
- Made sure we support more languages in the syntax highlighter


## [1.1.5] - 2018-01-15
A bunch of fixes and adjustments to ensure we have the same functionality as on the old grunt version of the project.

### Added
- Better support for "private" metadata in documentation files.
- Support for having code snipplets without rendered preview using "nopreview" in codeblock title

### Fixed
- Bug with startpage not showing the correct index.md content
