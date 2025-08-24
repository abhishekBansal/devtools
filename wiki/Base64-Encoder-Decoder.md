# Base64 Encoder/Decoder

**Category:** Encoding

**Description:** Encode and decode Base64 strings with UTF-8 support.

## Key Features

- **Unicode Support:** Correctly handles multi-byte characters (like emojis or accented letters) across both web and command-line interfaces.
- **Cross-Platform:** Works consistently in both browser (web app) and Node.js (CLI) environments.

## Web UI Guide

1.  Navigate to the **Base64 Encoder/Decoder** tool.
2.  Enter your text in the input field. The tool will automatically encode or decode the input in real-time.
3.  Use the "Copy" button to copy the result to your clipboard.
4.  Use the "Clear" button to reset the input fields.

## CLI Usage

### Encode

Encodes a string to Base64.

**Command**

```bash
devtools base64 encode <text>
```

**Example**

```bash
devtools base64 encode "Hello, World!"
# Output: SGVsbG8sIFdvcmxkIQ==
```

### Decode

Decodes a Base64 string.

**Command**

```bash
devtools base64 decode <encoded>
```

**Example**

```bash
devtools base64 decode "SGVsbG8sIFdvcmxkIQ=="
# Output: Hello, World!
```
