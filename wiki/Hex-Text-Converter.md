# Hex Text Converter

**Category:** Encoding

**Description:** Convert between hex, ASCII, binary, and decimal formats.

## Key Features
- **Multi-Format Conversion:** Supports conversions between hexadecimal, ASCII, binary, and decimal.
- **Robust Input Handling:** Automatically cleans input strings by removing spaces, making the tool more forgiving and user-friendly.
- **Validation:** Includes validation for each input type to ensure correct conversions and provide clear error messages.

## Web UI Guide
1.  Navigate to the **Hex Text Converter** tool.
2.  Enter your value in the appropriate input field (Hex, ASCII, Binary, or Decimal).
3.  The tool will automatically convert and display the results in the other formats in real-time.
4.  Use the "Copy" buttons to quickly copy results.
5.  Use the "Clear" button to reset all input fields.

## CLI Usage

### Convert Hex to ASCII
Converts a hexadecimal string to its ASCII representation.

**Command**
```bash
devtools hex to-ascii <hex>
```

**Example**
```bash
devtools hex to-ascii "48656C6C6F"
# Output: Hello
```

### Convert ASCII to Hex
Converts an ASCII string to its hexadecimal representation.

**Command**
```bash
devtools hex from-ascii <ascii>
```

**Example**
```bash
devtools hex from-ascii "World"
# Output: 574F524C44
```

### Convert Hex to Binary
Converts a hexadecimal string to its binary representation.

**Command**
```bash
devtools hex to-binary <hex>
```

**Example**
```bash
devtools hex to-binary "F"
# Output: 1111
```

### Convert Binary to Hex
Converts a binary string to its hexadecimal representation.

**Command**
```bash
devtools hex from-binary <binary>
```

**Example**
```bash
devtools hex from-binary "1111"
# Output: F
```

### Convert Hex to Decimal
Converts a hexadecimal string to its decimal representation.

**Command**
```bash
devtools hex to-decimal <hex>
```

**Example**
```bash
devtools hex to-decimal "A"
# Output: 10
```

### Convert Decimal to Hex
Converts a decimal number to its hexadecimal representation.

**Command**
```bash
devtools hex from-decimal <decimal>
```

**Example**
```bash
devtools hex from-decimal 255
# Output: FF