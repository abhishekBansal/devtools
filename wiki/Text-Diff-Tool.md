````markdown
# Text Diff Tool

**Category:** Text Tools

**Description:** Compare and visualize differences between two text blocks with intelligent inline highlighting.

## Key Features
- **Intelligent Line Comparison:** Uses advanced algorithms to detect line-by-line differences with precise similarity calculations.
- **Inline Word Highlighting:** Highlights specific word changes within modified lines, making it easy to spot exact differences.
- **Multiple Output Formats:** Provides both visual side-by-side diff and unified diff output.
- **Dark Mode Support:** Optimized colors and contrast for both light and dark themes.
- **Statistics Dashboard:** Shows detailed metrics including similarity percentage, added/removed/unchanged lines.
- **Copy to Clipboard:** Easy copying of diff results for sharing or documentation.

## Web UI Guide
1. Navigate to the **Text Diff Tool**.
2. Paste your original text in the left "Original Text" area.
3. Paste your modified text in the right "Modified Text" area.
4. The tool automatically computes differences and displays:
   - **Statistics Panel**: Similarity percentage and change counts
   - **Visual Diff**: Line-by-line comparison with inline word highlighting
   - **Unified Diff**: Traditional git-style diff output
5. Use the copy buttons to copy diff results to clipboard.
6. Click "Load Example" to see the tool in action with sample data.
7. Use "Clear All" to reset both text areas.

### Visual Indicators
- **Green highlighting**: Added content
- **Red highlighting**: Removed content  
- **Blue highlighting**: Modified content
- **Gray**: Unchanged content
- **Inline highlighting**: Specific word/character changes within lines

## CLI Usage

### Compare Text Strings
Compare two text strings directly.

**Command**
```bash
devtools diff text '<text1>' '<text2>'
```

**Example**
```bash
devtools diff text "Hello world" "Hello universe"
# Output:
# Diff Result (line mode):
# ========================
# - Hello world
# + Hello universe
# 
# Statistics:
# Added: 1, Removed: 1, Unchanged: 0
# Similarity: 50%
```

### Compare Files
Compare the contents of two files.

**Command**
```bash
devtools diff file '<file1>' '<file2>'
```

**Example**
```bash
devtools diff file config.old.json config.new.json
# Output:
# Diff Result (line mode):
# ========================
# Comparing files: config.old.json vs config.new.json
# 
#   {
# -   "version": "1.0.0",
# +   "version": "1.1.0",
#     "name": "myapp"
#   }
# 
# Statistics:
# Added: 1, Removed: 1, Unchanged: 2
# Similarity: 75%
```

### Options
- **`--no-color`**: Disable colored output for better compatibility with pipes and logs
- **`--help`**: Show detailed help for diff commands

**Example with no color**
```bash
devtools diff text "old text" "new text" --no-color
```

## Algorithm Details

The Text Diff Tool uses sophisticated algorithms for accurate difference detection:

- **Longest Common Subsequence (LCS)**: For optimal line and word alignment
- **Levenshtein Distance**: For calculating similarity percentages
- **Smart Similarity Threshold**: Only highlights inline changes when lines are sufficiently similar (>30%)
- **Word-Level Tokenization**: Precisely identifies changed words within lines

## Use Cases

- **Code Review**: Compare different versions of source code files
- **Configuration Management**: Track changes in config files
- **Documentation**: Compare document revisions
- **Data Analysis**: Identify differences in data files or logs
- **Version Control**: Understand changes before committing
- **Debugging**: Compare expected vs actual outputs

````
