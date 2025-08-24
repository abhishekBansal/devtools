# UUID Generator

**Category:** Code

**Description:** Generate and validate UUID v4 with bulk generation support.

## Key Features
- **RFC 4122 Compliant:** Generates valid UUID v4 identifiers that follow the RFC 4122 standard.
- **Bulk Generation:** Supports generating multiple UUIDs in a single operation.
- **Validation:** Includes UUID validation functionality to verify the format of existing UUIDs.

## Web UI Guide
1.  Navigate to the **UUID Generator** tool.
2.  Click the "Generate UUID" button to create a new UUID.
3.  Use the "Generate Multiple" button to create several UUIDs at once.
4.  Use the "Copy" button to copy the generated UUID to your clipboard.
5.  Use the "Validate" feature to check if a UUID string is valid.

## CLI Usage

### Generate Single UUID
Generates a single UUID v4.

**Command**
```bash
devtools uuid generate
```

**Example**
```bash
devtools uuid generate
# Output: a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

### Generate Multiple UUIDs
Generates multiple UUIDs at once.

**Command**
```bash
devtools uuid generate --count <number>
```

**Example**
```bash
devtools uuid generate --count 3
# Output:
# a1b2c3d4-e5f6-7890-abcd-ef1234567890
# b2c3d4e5-f6g7-8901-bcde-f23456789012
# c3d4e5f6-g7h8-9012-cdef-345678901234
```

### Validate UUID
Validates whether a string is a valid UUID.

**Command**
```bash
devtools uuid validate <uuid>
```

**Example**
```bash
devtools uuid validate "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
# Output: Valid UUID

devtools uuid validate "invalid-uuid"
# Output: Invalid UUID