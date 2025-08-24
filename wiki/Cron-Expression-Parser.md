# Cron Expression Parser

**Category:** Time

**Description:** Parse, validate, and explain cron expressions with human-readable descriptions.

## Key Features
- **Human-Readable Explanations:** Converts cron expressions into plain English descriptions.
- **Validation:** Validates the syntax and format of cron expressions.
- **Next Execution Time:** Shows when the cron job will run next.

## Web UI Guide
1.  Navigate to the **Cron Expression Parser** tool.
2.  Enter your cron expression in the input field (e.g., "0 9 * * 1").
3.  The tool will instantly validate and display the human-readable explanation.
4.  View the next execution time and any additional details.
5.  Use the "Copy" button to copy the explanation.

## CLI Usage

### Parse Cron Expression
Parses a cron expression and displays its explanation.

**Command**
```bash
devtools cron parse <expression>
```

**Example**
```bash
devtools cron parse "0 9 * * 1"
# Output: At 09:00 on Monday
```

### Validate Cron Expression
Validates whether a cron expression is well-formed.

**Command**
```bash
devtools cron validate <expression>
```

**Example**
```bash
devtools cron validate "0 9 * * 1"
# Output: Valid cron expression

devtools cron validate "invalid cron"
# Output: Invalid cron expression: Invalid minute field
```

### Get Next Execution Time
Shows the next time a cron expression will execute.

**Command**
```bash
devtools cron next <expression>
```

**Example**
```bash
devtools cron next "0 9 * * 1"
# Output: Next execution: Monday, December 25, 2023 at 09:00:00