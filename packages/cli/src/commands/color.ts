import { Command } from 'commander';
import { 
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  rgbToHsv,
  rgbToCmyk,
  cmykToRgb,
  analyzeColor
} from '@devtools/core';

export function colorCommand(): Command {
  const cmd = new Command('color');
  cmd.description('Color conversion and analysis tools');

  // Color analysis subcommand
  cmd
    .command('analyze')
    .description('Analyze color properties and accessibility')
    .argument('<color>', 'Color to analyze (hex string or RGB object)')
    .action((color) => {
      try {
        const analysis = analyzeColor(color);
        console.log('Color Analysis:');
        console.log('===============');
        console.log(`Hex: ${analysis.hex}`);
        console.log(`RGB: rgb(${analysis.rgb.r}, ${analysis.rgb.g}, ${analysis.rgb.b})`);
        console.log(`HSL: hsl(${analysis.hsl.h}°, ${analysis.hsl.s}%, ${analysis.hsl.l}%)`);
        console.log(`HSV: hsv(${analysis.hsv.h}°, ${analysis.hsv.s}%, ${analysis.hsv.v}%)`);
        console.log(`CMYK: cmyk(${analysis.cmyk.c}%, ${analysis.cmyk.m}%, ${analysis.cmyk.y}%, ${analysis.cmyk.k}%)`);
        console.log(`Luminance: ${analysis.luminance.toFixed(3)}`);
        console.log(`\nContrast Ratios:`);
        console.log(`  Against white: ${analysis.contrast.white.toFixed(2)}`);
        console.log(`  Against black: ${analysis.contrast.black.toFixed(2)}`);
        console.log(`\nAccessibility (WCAG):`);
        console.log(`  AA Normal text: ${analysis.accessibility.aa ? '✓' : '✗'}`);
        console.log(`  AAA Normal text: ${analysis.accessibility.aaa ? '✓' : '✗'}`);
      } catch (error) {
        console.error('Error analyzing color:', error instanceof Error ? error.message : error);
        process.exit(1);
      }
    });

  // Hex to RGB conversion
  cmd
    .command('hex-to-rgb')
    .description('Convert hex color to RGB')
    .argument('<hex>', 'Hex color (e.g., #FF0000 or FF0000)')
    .action((hex) => {
      try {
        const rgb = hexToRgb(hex);
        console.log(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`);
      } catch (error) {
        console.error('Error converting hex to RGB:', error instanceof Error ? error.message : error);
        process.exit(1);
      }
    });

  // RGB to hex conversion
  cmd
    .command('rgb-to-hex')
    .description('Convert RGB values to hex color')
    .argument('<r>', 'Red value (0-255)')
    .argument('<g>', 'Green value (0-255)')
    .argument('<b>', 'Blue value (0-255)')
    .action((r, g, b) => {
      try {
        const rVal = parseInt(r, 10);
        const gVal = parseInt(g, 10);
        const bVal = parseInt(b, 10);
        const hex = rgbToHex(rVal, gVal, bVal);
        console.log(hex);
      } catch (error) {
        console.error('Error converting RGB to hex:', error instanceof Error ? error.message : error);
        process.exit(1);
      }
    });

  // RGB to HSL conversion
  cmd
    .command('rgb-to-hsl')
    .description('Convert RGB values to HSL')
    .argument('<r>', 'Red value (0-255)')
    .argument('<g>', 'Green value (0-255)')
    .argument('<b>', 'Blue value (0-255)')
    .action((r, g, b) => {
      try {
        const rVal = parseInt(r, 10);
        const gVal = parseInt(g, 10);
        const bVal = parseInt(b, 10);
        const hsl = rgbToHsl(rVal, gVal, bVal);
        console.log(`hsl(${hsl.h}°, ${hsl.s}%, ${hsl.l}%)`);
      } catch (error) {
        console.error('Error converting RGB to HSL:', error instanceof Error ? error.message : error);
        process.exit(1);
      }
    });

  // HSL to RGB conversion
  cmd
    .command('hsl-to-rgb')
    .description('Convert HSL values to RGB')
    .argument('<h>', 'Hue (0-360)')
    .argument('<s>', 'Saturation percentage (0-100)')
    .argument('<l>', 'Lightness percentage (0-100)')
    .action((h, s, l) => {
      try {
        const hVal = parseInt(h, 10);
        const sVal = parseInt(s, 10);
        const lVal = parseInt(l, 10);
        const rgb = hslToRgb(hVal, sVal, lVal);
        console.log(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`);
      } catch (error) {
        console.error('Error converting HSL to RGB:', error instanceof Error ? error.message : error);
        process.exit(1);
      }
    });

  // RGB to HSV conversion
  cmd
    .command('rgb-to-hsv')
    .description('Convert RGB values to HSV')
    .argument('<r>', 'Red value (0-255)')
    .argument('<g>', 'Green value (0-255)')
    .argument('<b>', 'Blue value (0-255)')
    .action((r, g, b) => {
      try {
        const rVal = parseInt(r, 10);
        const gVal = parseInt(g, 10);
        const bVal = parseInt(b, 10);
        const hsv = rgbToHsv(rVal, gVal, bVal);
        console.log(`hsv(${hsv.h}°, ${hsv.s}%, ${hsv.v}%)`);
      } catch (error) {
        console.error('Error converting RGB to HSV:', error instanceof Error ? error.message : error);
        process.exit(1);
      }
    });

  // RGB to CMYK conversion
  cmd
    .command('rgb-to-cmyk')
    .description('Convert RGB values to CMYK')
    .argument('<r>', 'Red value (0-255)')
    .argument('<g>', 'Green value (0-255)')
    .argument('<b>', 'Blue value (0-255)')
    .action((r, g, b) => {
      try {
        const rVal = parseInt(r, 10);
        const gVal = parseInt(g, 10);
        const bVal = parseInt(b, 10);
        const cmyk = rgbToCmyk(rVal, gVal, bVal);
        console.log(`cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`);
      } catch (error) {
        console.error('Error converting RGB to CMYK:', error instanceof Error ? error.message : error);
        process.exit(1);
      }
    });

  // CMYK to RGB conversion
  cmd
    .command('cmyk-to-rgb')
    .description('Convert CMYK values to RGB')
    .argument('<c>', 'Cyan percentage (0-100)')
    .argument('<m>', 'Magenta percentage (0-100)')
    .argument('<y>', 'Yellow percentage (0-100)')
    .argument('<k>', 'Key (black) percentage (0-100)')
    .action((c, m, y, k) => {
      try {
        const cVal = parseInt(c, 10);
        const mVal = parseInt(m, 10);
        const yVal = parseInt(y, 10);
        const kVal = parseInt(k, 10);
        const rgb = cmykToRgb(cVal, mVal, yVal, kVal);
        console.log(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`);
      } catch (error) {
        console.error('Error converting CMYK to RGB:', error instanceof Error ? error.message : error);
        process.exit(1);
      }
    });

  return cmd;
}
