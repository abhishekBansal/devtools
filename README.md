# DevTools Platform

A unified developer tools platform providing both a web application and CLI utilities for common development tasks.

## 🎯 Features

### Core Utilities

#### Encoding & Conversion
- **Base64 Encoder/Decoder** - Encode and decode Base64 strings with UTF-8 support
- **Hex Converter** - Convert between hex, ASCII, binary, and decimal formats

#### JSON & Data Processing  
- **JSON Validator & Formatter** - Validate, format, and minify JSON with error highlighting
- **XML Formatter** - Format, validate, and minify XML documents with proper indentation and error checking

#### Text Processing
- **String Analyzer** - Analyze text strings to get detailed statistics including character count, word count, and more
- **String Case Converter** - Convert text between different case formats including camelCase, snake_case, kebab-case, and more

#### Time & Scheduling
- **Timestamp Converter** - Convert between Unix timestamps and human-readable dates
- **Cron Expression Parser** - Parse, validate, and explain cron expressions with human-readable descriptions

#### Development Tools
- **UUID Generator** - Generate and validate UUID v4 with bulk generation support
- **Color Converter** - Convert colors between different formats (Hex, RGB, HSL, HSV, CMYK) and analyze accessibility

### Platforms
- **Web App** - React-based SPA with responsive design and dark/light themes
- **CLI Tool** - Node.js command-line interface for terminal workflows
- **Shared Core** - TypeScript library used by both web and CLI applications

## 🚀 Quick Start

### Web Application
Visit the hosted web application or run locally:

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

### CLI Installation

```bash
# Install globally from npm (when published)
npm install -g devtools-cli

# Or run locally
cd packages/cli
pnpm install
pnpm build
node bin/devtools --help
```

## 📖 CLI Usage

```bash
# Base64 operations
devtools base64 encode "Hello World"
devtools base64 decode "SGVsbG8gV29ybGQ="

# JSON operations
devtools json validate '{"name": "test"}'
devtools json format '{"name":"test","value":123}'
devtools json minify '{\n  "name": "test"\n}'

# UUID operations
devtools uuid generate
devtools uuid generate --count 5
devtools uuid validate "550e8400-e29b-41d4-a716-446655440000"

# Hex conversions
devtools hex to-ascii "48656C6C6F"
devtools hex from-ascii "Hello"
devtools hex to-binary "FF"
devtools hex to-decimal "FF"

# Timestamp conversions
devtools timestamp to-iso 1672531200
devtools timestamp to-unix "2023-01-01T00:00:00.000Z"
devtools timestamp now
devtools timestamp format 1672531200

# Cron expression operations
devtools cron validate "0 9 * * 1-5"
devtools cron explain "@daily"
devtools cron expand "@hourly"
devtools cron presets
devtools cron presets --format json

# String analysis and conversion
devtools string analyze "Hello World! How are you?"
devtools string camel "hello world"
devtools string pascal "hello world"
devtools string snake "Hello World"
devtools string kebab "Hello World"
devtools string constant "hello world"
devtools string title "hello world"
devtools string sentence "HELLO WORLD"

# XML operations
devtools xml validate '<root><item>test</item></root>'
devtools xml format '<root><item>test</item></root>' --indent 4
devtools xml minify '<root>\n  <item>test</item>\n</root>'
devtools xml analyze '<root><item>test</item></root>'

# Color conversions
devtools color analyze "#FF0000"
devtools color hex-to-rgb "#FF0000"
devtools color rgb-to-hex 255 0 0
devtools color rgb-to-hsl 255 0 0
devtools color hsl-to-rgb 0 100 50
devtools color rgb-to-hsv 255 0 0
devtools color rgb-to-cmyk 255 0 0
devtools color cmyk-to-rgb 0 100 100 0
```

## 🏗️ Architecture

### Monorepo Structure
```
/
├── packages/
│   ├── core/          # Shared TypeScript utilities
│   └── cli/           # Node.js CLI application
├── apps/
│   └── web/           # React web application
└── docs/              # Documentation
```

### Core Library
The `@devtools/core` package contains platform-agnostic TypeScript functions that power both the web and CLI applications:

- Pure functions with no DOM or Node.js dependencies
- Comprehensive error handling
- Full TypeScript support with type definitions
- 100% test coverage

### Web Application
- **Framework**: React 19 + TypeScript
- **UI Library**: Ant Design
- **Routing**: React Router
- **Build Tool**: Vite
- **Features**: 
  - Responsive design
  - Dark/light theme toggle
  - SEO optimization with React Helmet
  - PWA support
  - Real-time validation

### CLI Application
- **Runtime**: Node.js 18+
- **Framework**: Commander.js
- **Features**:
  - Intuitive command structure
  - Help documentation
  - Error handling with proper exit codes
  - Cross-platform compatibility

## 🛠️ Development

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm

### Setup
```bash
# Clone repository
git clone <repository-url>
cd devtools

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Start web development
pnpm dev

# Lint all packages
pnpm lint
```

### Adding a New Tool

1. **Core Library** (`packages/core/src/`)
   - Create new utility module (e.g., `newTool.ts`)
   - Add comprehensive tests
   - Export from `index.ts`

2. **Web Application** (`apps/web/src/`)
   - Add tool definition to `data/tools.ts`
   - Create tool page component
   - Add route to `App.tsx`

3. **CLI Application** (`packages/cli/src/`)
   - Create command module in `commands/`
   - Register command in `index.ts`
   - Add tests

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Test specific package
pnpm --filter @devtools/core test
pnpm --filter devtools-cli test

# Watch mode
pnpm --filter @devtools/core test:watch
```

## 📦 Building & Deployment

### Web Application
```bash
# Build for production
pnpm --filter @devtools/web build

# Preview production build
pnpm --filter @devtools/web preview
```

### CLI Package
```bash
# Build CLI
pnpm --filter devtools-cli build

# Test local installation
pnpm --filter devtools-cli link -g
devtools --help
```

## 🔧 Configuration

### Environment Variables (Web)
- `VITE_GA_MEASUREMENT_ID` - Google Analytics 4 Measurement ID
- `VITE_ADS_ENABLED` - Enable/disable ad slots (future feature)

## 📝 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## 🚧 Roadmap

- [x] **Cron Expression Parser** - Parse, validate, and explain cron expressions
- [ ] Additional utility tools (URL encoder, hash generators, etc.)
- [ ] File input/output support for CLI
- [ ] Interactive CLI mode
- [ ] VS Code extension
- [ ] API endpoints
- [ ] Tool favorites and history
- [ ] Custom tool configurations

---

Built with ❤️ using React, TypeScript, and Node.js
