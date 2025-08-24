# JSON Validator & Formatter

**Category:** JSON & Data

**Description:** Validate, format, and minify JSON with error highlighting.

## Key Features
- **Detailed Error Reporting:** When JSON is invalid, the tool provides a specific error message, helping you pinpoint the exact syntax issue.
- **Configurable Formatting:** The CLI allows you to specify the number of spaces for indentation when formatting.
- **Multiple Operations:** Supports validation, formatting (pretty-printing), and minification.

## Web UI Guide
1.  Navigate to the **JSON Validator & Formatter** tool.
2.  Paste your JSON into the input editor.
3.  The tool will instantly validate the JSON and display a "Valid" or "Invalid" status.
4.  If invalid, the specific error will be shown below the editor.
5.  Use the "Format" and "Minify" buttons to transform your JSON.
6.  Use the "Copy" and "Clear" buttons for easy workflow.

## CLI Usage

### Validate
Checks if a JSON string is well-formed.

**Command**
```bash
devtools json validate '<json>'
```

**Example**
```bash
devtools json validate '{"key": "value"}'
# Output: ✓ Valid JSON

devtools json validate '{"key": "value",}'
# Output: ✗ Invalid JSON: Unexpected token } in JSON at position 17
```

### Format
Pretty-prints a JSON string with indentation.

**Command**
```bash
devtools json format '<json>' [--indent <number>]
```

**Example**
```bash
devtools json format '{"key":"value"}' --indent 4
# Output:
# {
#     "key": "value"
# }
```

### Minify
Removes all whitespace from a JSON string.

**Command**
```bash
devtools json minify '<json>'
```

**Example**
```bash
devtools json minify '{ "key": "value" }'
# Output: {"key":"value"}