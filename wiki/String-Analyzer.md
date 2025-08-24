# String Analyzer

**Category:** Text

**Description:** Analyze text strings to get detailed statistics including character count, word count, and more.

## Key Features
- **Comprehensive Statistics:** Provides detailed analysis including character count, word count, line count, and more.
- **Text Metrics:** Shows byte size, character frequency, and other useful metrics.
- **Real-time Analysis:** Updates statistics as you type or modify the input.

## Web UI Guide
1.  Navigate to the **String Analyzer** tool.
2.  Enter or paste your text in the input area.
3.  View the real-time statistics panel showing character count, word count, and other metrics.
4.  Use the "Copy" button to copy the analysis results.
5.  Use the "Clear" button to reset the input and analysis.

## CLI Usage

### Analyze Text
Analyzes a string and displays comprehensive statistics.

**Command**
```bash
devtools string analyze "<text>"
```

**Example**
```bash
devtools string analyze "Hello, World! How are you?"
# Output:
# Characters: 25
# Words: 5
# Lines: 1
# Bytes: 25
# Character Frequency:
#   H: 1
#   e: 2
#   l: 3
#   o: 3
#   ,: 1
#   W: 1
#   r: 1
#   d: 1
#   !: 1
#   space: 4
```

### Count Characters
Returns the character count of a string.

**Command**
```bash
devtools string count-chars "<text>"
```

**Example**
```bash
devtools string count-chars "Hello World"
# Output: 11
```

### Count Words
Returns the word count of a string.

**Command**
```bash
devtools string count-words "<text>"
```

**Example**
```bash
devtools string count-words "Hello World"
# Output: 2