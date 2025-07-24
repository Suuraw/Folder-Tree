# Change Log

All notable changes to the "Generate Folder Tree" extension will be documented in this file.

The format is based on [Keep a Changelog](http.keepachangelog.com/), and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

- (Your future changes will go here)

## [1.1.0] - 2025-07-20

### Added

- **New Input Formats:** Added support for Markdown-style (`|--`) and bullet point (`*` or `-`) tree structures.
- **New Command:** Introduced `Generate Folder Tree: Create from Text Outline` to generate a structure directly from the active text file.
- **Configuration Settings:** Users can now configure `folderTree.overwriteExisting` in their settings.

### Changed

- Improved parsing logic to be more flexible with indentation.
- Updated README with examples for all supported formats and new settings.

## [1.0.1] - 2025-06-24

### Fixed

- Resolved an issue where empty lines in the input would cause an error.
- Corrected a bug where files starting with a dot (e.g., `.gitignore`) were sometimes ignored.
- Minor performance improvements for generating very large trees.

## [1.0.0] - 2025-06-23

### Added

- Initial release of **Generate Folder Tree**.
- Core functionality to generate a folder and file structure from an input panel.
- Support for indented text (spaces or tabs) as the primary input format.
