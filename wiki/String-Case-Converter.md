# String Case Converter

**Category:** Text

**Description:** Convert text between different case formats including camelCase, snake_case, kebab-case, and more.

## Key Features
- **Multiple Case Formats:** Supports conversion to camelCase, PascalCase, snake_case, kebab-case, UPPER_CASE, and lowercase.
- **Real-time Conversion:** Converts text as you type, showing all formats simultaneously.
- **Preserve Original:** Maintains the original text for reference.

## Web UI Guide
1.  Navigate to the **String Case Converter** tool.
2.  Enter your text in the input field.
3.  View all the different case conversions in the results panel.
4.  Click on any converted text to copy it to your clipboard.
5.  Use the "Clear" button to reset the input and conversions.

## CLI Usage

### Convert to camelCase
Converts text to camelCase format.

**Command**
```bash
devtools string to-camel "<text>"
```

**Example**
```bash
devtools string to-camel "hello world example"
# Output: helloWorldExample
```

### Convert to PascalCase
Converts text to PascalCase format.

**Command**
```bash
devtools string to-pascal "<text>"
```

**Example**
```bash
devtools string to-pascal "hello world example"
# Output: HelloWorldExample
```

### Convert to snake_case
Converts text to snake_case format.

**Command**
```bash
devtools string to-snake "<text>"
```

**Example**
```bash
devtools string to-snake "HelloWorldExample"
# Output: hello_world_example
```

### Convert to kebab-case
Converts text to kebab-case format.

**Command**
```bash
devtools string to-kebab "<text>"
```

**Example**
```bash
devtools string to-kebab "HelloWorldExample"
# Output: hello-world-example
```

### Convert to UPPER_CASE
Converts text to UPPER_CASE format.

**Command**
```bash
devtools string to-upper "<text>"
```

**Example**
```bash
devtools string to-upper "hello world example"
# Output: HELLO_WORLD_EXAMPLE
```

### Convert to lowercase
Converts text to lowercase format.

**Command**
```bash
devtools string to-lower "<text>"
```

**Example**
```bash
devtools string to-lower "HELLO WORLD EXAMPLE"
# Output: hello world example