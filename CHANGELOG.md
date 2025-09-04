# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-09-03

### Added
- **Text Diff Tool**: Complete text diffing functionality for comparing text strings and files
  - Advanced diff algorithms using Longest Common Subsequence (LCS) and Levenshtein distance
  - Intelligent word-level highlighting for changed lines
  - Similarity calculation and statistics (added, removed, unchanged lines)
  - Support for both text string comparison and file comparison
- **CLI Commands**:
  - `devtools diff text <text1> <text2>` - Compare two text strings
  - `devtools diff file <file1> <file2>` - Compare two files
  - Color-coded output using chalk for better readability (green for additions, red for deletions)
- **Web Interface**:
  - Interactive text diff page with side-by-side comparison
  - Theme-aware colors for both light and dark modes
  - Inline highlighting of changed words within lines
  - Real-time diff calculation as you type
  - Copy to clipboard functionality
- **Core Library**:
  - `diffLinesWithInlineChanges()` function for advanced diff processing
  - `DiffResult`, `DiffLine`, and `InlineChange` interfaces
  - Comprehensive test suite with 38 test cases covering edge cases

### Enhanced
- **CLI Package**: Updated to version 1.1.0 with text-diff related keywords
- **Core Package**: Updated to version 1.1.0 with diff functionality
- **Documentation**: Added comprehensive wiki documentation for the text diff tool
- **Build System**: Ensured all packages build successfully with new dependencies

### Technical Details
- Implemented smart similarity thresholds for word-level highlighting
- Added efficient tokenization for word-boundary detection
- Integrated chalk for colorized CLI output
- Added theme-aware color functions for web interface
- Comprehensive error handling and edge case coverage

### Testing
- 38 comprehensive test cases for diff functionality
- Tests cover various scenarios: empty inputs, single lines, multiline text, edge cases
- All existing functionality tests continue to pass

---

## [1.0.1] - 2025-08-27 (Previous Release)

### Enhanced
- Improved CLI package structure and dependencies
- Updated package keywords for better discoverability

### Fixed
- Various bug fixes and improvements

---

## [1.0.0] - 2025-08-20 (Initial Release)

### Added
- **Core Developer Tools**:
  - Base64 Encoder/Decoder with UTF-8 support
  - JSON Validator and Formatter with minification
  - Hex Text Converter (hex ↔ text, hex ↔ binary, hex ↔ decimal)
  - Timestamp Converter (Unix ↔ ISO, timezone support)
  - UUID Generator (v4) with session history
  - String Analyzer (character count, word count, line count)
  - String Case Converter (camelCase, PascalCase, snake_case, kebab-case, etc.)
  - XML Formatter and Validator
  - Color Converter (Hex, RGB, HSL, HSV, CMYK)
  - Cron Expression Parser and Validator

- **Web Application**:
  - React-based web interface with Ant Design components
  - Dark/Light theme support with persistence
  - Responsive design for desktop and mobile
  - Search functionality for tools
  - Recently used tools tracking
  - SEO optimized with meta tags and structured data

- **CLI Application**:
  - Command-line interface for all tools
  - File input/output support
  - Pipe and stdin support
  - Cross-platform compatibility (Node.js 18+)

- **Development Infrastructure**:
  - Monorepo structure with pnpm workspaces
  - TypeScript throughout with strict configuration
  - Comprehensive test suites with Vitest
  - Build system with tsup (ESM/CJS support)
  - ESLint and Prettier for code quality
  - GitHub Actions CI/CD pipeline

### Technical Architecture
- **@devtools/core**: Pure TypeScript utility functions
- **@devtools-cli/devtools-cli**: CLI package using Commander.js
- **@devtools/web**: React web application using Vite
- Shared utilities between CLI and web interfaces
- Tree-shakeable builds for optimal bundle sizes

---

## Future Releases

For upcoming features and improvements, see our [TODO.md](docs/TODO.md) file.

## Contributing

We welcome contributions! Please see our contributing guidelines for more information.

## License

This project is licensed under the MIT License - see the [LICENSE.MD](LICENSE.MD) file for details.
