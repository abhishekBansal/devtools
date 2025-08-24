# Timestamp Converter

**Category:** Time

**Description:** Convert between Unix timestamps and human-readable dates.

## Key Features
- **Auto-Detection:** Automatically detects whether input timestamps are in seconds or milliseconds.
- **Multiple Formats:** Supports conversion between Unix timestamps, ISO 8601 strings, and human-readable formats.
- **Flexible Formatting:** Allows custom formatting options for human-readable output.

## Web UI Guide
1.  Navigate to the **Timestamp Converter** tool.
2.  Enter your timestamp or ISO date in the input field.
3.  The tool will automatically detect the format and convert it to the other formats.
4.  Use the "Now" button to get the current timestamp.
5.  Use the "Copy" buttons to quickly copy results.
6.  Use the "Clear" button to reset all input fields.

## CLI Usage

### Convert Unix to ISO
Converts a Unix timestamp to an ISO 8601 formatted string.

**Command**
```bash
devtools timestamp to-iso <timestamp>
```

**Example**
```bash
devtools timestamp to-iso 1640995200
# Output: 2021-12-31T16:00:00.000Z
```

### Convert ISO to Unix
Converts an ISO 8601 string to a Unix timestamp.

**Command**
```bash
devtools timestamp to-unix <iso>
```

**Example**
```bash
devtools timestamp to-unix "2021-12-31T16:00:00.000Z"
# Output: 1640995200
```

### Get Current Timestamp
Displays the current timestamp in various formats.

**Command**
```bash
devtools timestamp now [options]
```

**Examples**
```bash
# Get current Unix timestamp
devtools timestamp now --unix
# Output: 1693257600

# Get current ISO timestamp
devtools timestamp now --iso
# Output: 2023-08-28T16:00:00.000Z

# Get current formatted timestamp
devtools timestamp now --format
# Output: August 28, 2023 at 04:00:00 PM UTC

# Get all formats (default)
devtools timestamp now
# Output:
# Unix: 1693257600
# ISO: 2023-08-28T16:00:00.000Z
# Formatted: August 28, 2023 at 04:00:00 PM UTC
```

### Format Timestamp
Converts a timestamp to a human-readable format.

**Command**
```bash
devtools timestamp format <timestamp>
```

**Example**
```bash
devtools timestamp format 1640995200
# Output: December 31, 2021 at 04:00:00 PM UTC