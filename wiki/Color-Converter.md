# Color Converter

**Category:** Code

**Description:** Convert colors between different formats (Hex, RGB, HSL, HSV, CMYK) and analyze accessibility.

## Key Features
- **Multiple Format Conversion:** Supports conversion between Hex, RGB, HSL, HSV, and CMYK color formats.
- **Real-time Preview:** Shows color previews as you type or select different formats.
- **Accessibility Analysis:** Provides WCAG contrast ratio information for accessibility compliance.
- **Color Picker:** Includes visual color picker for intuitive color selection.

## Web UI Guide
1.  Navigate to the **Color Converter** tool.
2.  Enter a color in any supported format (Hex, RGB, HSL, etc.) in the input field.
3.  View the color converted to all other formats in real-time.
4.  Use the color picker to select colors visually.
5.  Check the accessibility section for contrast ratio information.
6.  Use the "Copy" buttons to copy specific color values.

## CLI Usage

### Convert to Hex
Converts a color to hexadecimal format.

**Command**
```bash
devtools color to-hex "<color>"
```

**Example**
```bash
devtools color to-hex "rgb(255, 0, 0)"
# Output: #ff0000
```

### Convert to RGB
Converts a color to RGB format.

**Command**
```bash
devtools color to-rgb "<color>"
```

**Example**
```bash
devtools color to-rgb "#ff0000"
# Output: rgb(255, 0, 0)
```

### Convert to HSL
Converts a color to HSL format.

**Command**
```bash
devtools color to-hsl "<color>"
```

**Example**
```bash
devtools color to-hsl "#ff0000"
# Output: hsl(0, 100%, 50%)
```

### Convert to HSV
Converts a color to HSV format.

**Command**
```bash
devtools color to-hsv "<color>"
```

**Example**
```bash
devtools color to-hsv "#ff0000"
# Output: hsv(0, 100%, 100%)
```

### Convert to CMYK
Converts a color to CMYK format.

**Command**
```bash
devtools color to-cmyk "<color>"
```

**Example**
```bash
devtools color to-cmyk "#ff0000"
# Output: cmyk(0%, 100%, 100%, 0%)
```

### Analyze Contrast
Analyzes the contrast ratio between two colors.

**Command**
```bash
devtools color contrast "<color1>" "<color2>"
```

**Example**
```bash
devtools color contrast "#ffffff" "#000000"
# Output: Contrast ratio: 21.0 (AAA compliant)