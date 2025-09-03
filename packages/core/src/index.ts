/**
 * Devtools Core Library
 * Shared utilities for web and CLI applications
 */

// Base64 utilities
export {
  encodeBase64,
  decodeBase64,
} from './base64.js';

// JSON utilities
export {
  validateJson,
  formatJson,
  minifyJson,
  type JsonValidationResult,
} from './json.js';

// Hex conversion utilities
export {
  hexToAscii,
  asciiToHex,
  hexToBinary,
  binaryToHex,
  hexToDecimal,
  decimalToHex,
} from './hex.js';

// Timestamp utilities
export {
  unixToIso,
  isoToUnix,
  getCurrentUnixTimestamp,
  getCurrentIsoTimestamp,
  formatTimestamp,
} from './timestamp.js';

// UUID utilities
export {
  generateUuidV4,
  isValidUuid,
  generateMultipleUuids,
} from './uuid.js';

// Cron utilities
export {
  validateCronExpression,
  explainCronExpression,
  expandCronExpression,
  getNextExecutions,
  CRON_PRESETS,
} from './cron.js';

// String utilities
export {
  analyzeString,
  convertCase,
  toCamelCase,
  toPascalCase,
  toSnakeCase,
  toKebabCase,
  toConstantCase,
  toTitleCase,
  toSentenceCase,
  getAllCaseConversions,
  type StringAnalysis,
  type CaseType,
} from './string.js';

// XML utilities
export {
  validateXml,
  formatXml,
  minifyXml,
  analyzeXml,
  type XmlValidationResult,
} from './xml.js';

// Color utilities
export {
  validateHexColor,
  validateRgbColor,
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  rgbToHsv,
  rgbToCmyk,
  cmykToRgb,
  calculateLuminance,
  calculateContrastRatio,
  analyzeColor,
  type RgbColor,
  type HslColor,
  type HsvColor,
  type CmykColor,
  type ColorAnalysis,
} from './color.js';

// Diff utilities
export {
  diffText,
  diffLines,
  diffWords,
  diffCharacters,
  diffLinesWithInlineChanges,
  createUnifiedDiff,
  createSideBySideDiff,
  type DiffResult,
  type DiffLine,
  type DiffMode,
  type InlineChange,
} from './diff.js';
