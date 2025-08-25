# @devtools-cli/devtools-cli

A powerful command-line interface (CLI) for essential developer utilities. Access a wide range of tools directly from your terminal, including Base64 encoding/decoding, JSON formatting, UUID generation, timestamp conversions, and more.

## 🌟 Features

-   **🚀 Fast & Efficient**: Perform common development tasks quickly without leaving your terminal.
-   **🔧 Comprehensive Toolset**: Includes tools for encoding, data formatting, text analysis, time conversions, and unique ID generation.
-   **💻 Easy to Use**: Simple command structure with clear arguments and options.
-   **🌐 Cross-Platform**: Works on any operating system with Node.js installed.

## 📦 Installation

Install the DevTools CLI globally using npm or pnpm:

```bash
npm install -g @devtools-cli/devtools-cli
# or
pnpm install -g @devtools-cli/devtools-cli
```

## 🚀 Usage

Once installed, you can access the `devtools` command from your terminal:

```bash
devtools --help
```

This will display a list of available commands and their descriptions.

### Examples

Here are a few examples of how to use the `devtools` CLI:

#### Base64 Encoding/Decoding

```bash
# Encode text to Base64
devtools base64 encode "Hello, World!"

# Decode Base64 to text
devtools base64 decode "SGVsbG8sIFdvcmxkIQ=="
```

#### JSON Formatting

```bash
# Format a JSON string with 4-space indentation
devtools json format '{"name":"John Doe","age":30}' --indent 4

# Minify a JSON string
devtools json minify '{"name":"John Doe","age":30, "city": "New York"}'

# Validate a JSON string
devtools json validate '{"name":"John Doe"}'
```

#### UUID Generation

```bash
# Generate a single UUID v4
devtools uuid generate

# Generate 3 UUID v4s
devtools uuid generate --count 3

# Validate a UUID
devtools uuid validate "a1b2c3d4-e5f6-7890-1234-567890abcdef"
```

#### Timestamp Conversion

```bash
# Get current Unix timestamp
devtools timestamp now --unix

# Convert Unix timestamp to ISO string
devtools timestamp to-iso 1678886400

# Convert ISO string to Unix timestamp
devtools timestamp to-unix "2023-03-15T00:00:00.000Z"
```

#### Hexadecimal Conversion

```bash
# Convert hex to ASCII
devtools hex to-ascii "48656c6c6f"

# Convert ASCII to hex
devtools hex from-ascii "Hello"
```

## 📚 Available Commands

The `devtools` CLI provides the following top-level commands:

-   `base64`: Base64 encoding and decoding utilities.
-   `json`: JSON validation and formatting utilities.
-   `hex`: Hexadecimal conversion utilities (to/from ASCII, binary, decimal).
-   `timestamp`: Timestamp conversion utilities (Unix, ISO, human-readable).
-   `uuid`: UUID generation and validation utilities.
-   `cron`: Cron expression parsing and explanation.
-   `string`: String analysis and case conversion tools.
-   `xml`: XML formatting and validation.
-   `color`: Color conversion and analysis.

For detailed usage of each command, use `devtools [command] --help`. For example:

```bash
devtools base64 --help
devtools json --help
```

## 🤝 Contributing

Contributions are welcome! Please refer to the main project's [CONTRIBUTING.md](https://github.com/abhishekbansal/devtools/blob/master/CONTRIBUTING.md) for guidelines.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.MD](../../LICENSE.MD) file for details.

## 📞 Support

-   🐛 **Issues**: [GitHub Issues](https://github.com/abhishekbansal/devtools/issues)
-   💬 **Discussions**: [GitHub Discussions](https://github.com/abhishekbansal/devtools/discussions)

---

**Made with ❤️ by [Abhishek Bansal](https://github.com/abhishekbansal)**