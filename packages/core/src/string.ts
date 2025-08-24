/**
 * String analysis utilities for text inspection and statistics
 */

export interface StringAnalysis {
  length: number;
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  bytes: number;
  whitespace: number;
  digits: number;
  letters: number;
  uppercase: number;
  lowercase: number;
  specialChars: number;
}

/**
 * Analyzes a string and returns comprehensive statistics
 */
export function analyzeString(text: string): StringAnalysis {
  if (typeof text !== 'string') {
    throw new Error('Input must be a string');
  }

  const length = text.length;
  const characters = length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;
  
  // Word count - split by whitespace and filter empty strings
  const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).filter(word => word.length > 0).length;
  
  // Sentence count - split by sentence endings
  const sentences = text.trim() === '' ? 0 : text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0).length;
  
  // Paragraph count - split by double line breaks
  const paragraphs = text.trim() === '' ? 0 : text.split(/\n\s*\n/).filter(para => para.trim().length > 0).length;
  
  // Line count - split by line breaks
  const lines = text === '' ? 0 : text.split(/\n/).length;
  
  // Byte count (UTF-8)
  const bytes = new TextEncoder().encode(text).length;
  
  // Character type counts
  const whitespace = (text.match(/\s/g) || []).length;
  const digits = (text.match(/\d/g) || []).length;
  const letters = (text.match(/[a-zA-Z]/g) || []).length;
  const uppercase = (text.match(/[A-Z]/g) || []).length;
  const lowercase = (text.match(/[a-z]/g) || []).length;
  const specialChars = length - letters - digits - whitespace;

  return {
    length,
    characters,
    charactersNoSpaces,
    words,
    sentences,
    paragraphs,
    lines,
    bytes,
    whitespace,
    digits,
    letters,
    uppercase,
    lowercase,
    specialChars
  };
}

/**
 * String case conversion utilities
 */

export type CaseType = 
  | 'camelCase'
  | 'PascalCase'
  | 'snake_case'
  | 'kebab-case'
  | 'CONSTANT_CASE'
  | 'Title Case'
  | 'sentence case'
  | 'UPPERCASE'
  | 'lowercase';

/**
 * Converts a string to camelCase
 */
export function toCamelCase(text: string): string {
  return text
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '')
    .replace(/[-_]/g, '');
}

/**
 * Converts a string to PascalCase
 */
export function toPascalCase(text: string): string {
  return text
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => {
      return word.toUpperCase();
    })
    .replace(/\s+/g, '')
    .replace(/[-_]/g, '');
}

/**
 * Converts a string to snake_case
 */
export function toSnakeCase(text: string): string {
  return text
    .replace(/\W+/g, ' ')
    .split(/ |\B(?=[A-Z])/)
    .map(word => word.toLowerCase())
    .join('_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

/**
 * Converts a string to kebab-case
 */
export function toKebabCase(text: string): string {
  return text
    .replace(/\W+/g, ' ')
    .split(/ |\B(?=[A-Z])/)
    .map(word => word.toLowerCase())
    .join('-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Converts a string to CONSTANT_CASE
 */
export function toConstantCase(text: string): string {
  return toSnakeCase(text).toUpperCase();
}

/**
 * Converts a string to Title Case
 */
export function toTitleCase(text: string): string {
  return text.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

/**
 * Converts a string to sentence case
 */
export function toSentenceCase(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Converts string to specified case type
 */
export function convertCase(text: string, caseType: CaseType): string {
  if (typeof text !== 'string') {
    throw new Error('Input must be a string');
  }

  switch (caseType) {
    case 'camelCase':
      return toCamelCase(text);
    case 'PascalCase':
      return toPascalCase(text);
    case 'snake_case':
      return toSnakeCase(text);
    case 'kebab-case':
      return toKebabCase(text);
    case 'CONSTANT_CASE':
      return toConstantCase(text);
    case 'Title Case':
      return toTitleCase(text);
    case 'sentence case':
      return toSentenceCase(text);
    case 'UPPERCASE':
      return text.toUpperCase();
    case 'lowercase':
      return text.toLowerCase();
    default:
      throw new Error(`Unsupported case type: ${caseType}`);
  }
}

/**
 * Gets all available case conversions for a string
 */
export function getAllCaseConversions(text: string): Record<CaseType, string> {
  const caseTypes: CaseType[] = [
    'camelCase',
    'PascalCase', 
    'snake_case',
    'kebab-case',
    'CONSTANT_CASE',
    'Title Case',
    'sentence case',
    'UPPERCASE',
    'lowercase'
  ];

  const result: Record<CaseType, string> = {} as Record<CaseType, string>;
  
  caseTypes.forEach(caseType => {
    try {
      result[caseType] = convertCase(text, caseType);
    } catch (error) {
      result[caseType] = text; // fallback to original
    }
  });

  return result;
}
