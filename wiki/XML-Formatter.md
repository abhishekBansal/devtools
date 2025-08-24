# XML Formatter

**Category:** JSON & Data

**Description:** Format, validate, and minify XML documents with proper indentation and error checking.

## Key Features
- **XML Validation:** Validates XML syntax and structure.
- **Pretty Printing:** Formats XML with proper indentation for readability.
- **Minification:** Removes whitespace to create compact XML.
- **Error Highlighting:** Shows specific error locations when XML is invalid.

## Web UI Guide
1.  Navigate to the **XML Formatter** tool.
2.  Paste your XML content in the input editor.
3.  The tool will automatically validate and display the status.
4.  Use the "Format" button to pretty-print the XML with proper indentation.
5.  Use the "Minify" button to remove all whitespace.
6.  Use the "Copy" and "Clear" buttons for easy workflow.

## CLI Usage

### Format XML
Pretty-prints XML with proper indentation.

**Command**
```bash
devtools xml format '<xml>' [--indent <number>]
```

**Example**
```bash
devtools xml format '<root><item>value</item></root>' --indent 2
# Output:
# <root>
#   <item>value</item>
# </root>
```

### Minify XML
Removes all whitespace from XML.

**Command**
```bash
devtools xml minify '<xml>'
```

**Example**
```bash
devtools xml minify '<root>  <item>value</item>  </root>'
# Output: <root><item>value</item></root>
```

### Validate XML
Validates XML syntax and structure.

**Command**
```bash
devtools xml validate '<xml>'
```

**Example**
```bash
devtools xml validate '<root><item>value</item></root>'
# Output: Valid XML

devtools xml validate '<root><item>value</item>'
# Output: Invalid XML: Unclosed tag