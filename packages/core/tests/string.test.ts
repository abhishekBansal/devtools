import { describe, it, expect } from 'vitest';
import {
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
} from '../src/string.js';

describe('string utilities', () => {
  describe('analyzeString', () => {
    it('should analyze empty string', () => {
      const result = analyzeString('');
      expect(result).toEqual({
        length: 0,
        characters: 0,
        charactersNoSpaces: 0,
        words: 0,
        sentences: 0,
        paragraphs: 0,
        lines: 0,
        bytes: 0,
        whitespace: 0,
        digits: 0,
        letters: 0,
        uppercase: 0,
        lowercase: 0,
        specialChars: 0
      });
    });

    it('should analyze simple text', () => {
      const text = 'Hello World!';
      const result = analyzeString(text);
      
      expect(result.length).toBe(12);
      expect(result.words).toBe(2);
      expect(result.sentences).toBe(1);
      expect(result.letters).toBe(10);
      expect(result.uppercase).toBe(2);
      expect(result.lowercase).toBe(8);
      expect(result.whitespace).toBe(1);
      expect(result.specialChars).toBe(1);
    });

    it('should analyze multi-paragraph text', () => {
      const text = 'First paragraph.\n\nSecond paragraph.';
      const result = analyzeString(text);
      
      expect(result.paragraphs).toBe(2);
      expect(result.sentences).toBe(2);
      expect(result.lines).toBe(3);
    });

    it('should count bytes correctly for UTF-8', () => {
      const text = 'café'; // é is 2 bytes in UTF-8
      const result = analyzeString(text);
      
      expect(result.length).toBe(4);
      expect(result.bytes).toBe(5);
    });

    it('should throw error for non-string input', () => {
      expect(() => analyzeString(123 as any)).toThrow('Input must be a string');
    });
  });

  describe('case conversion utilities', () => {
    const testString = 'hello world example';
    
    it('should convert to camelCase', () => {
      expect(toCamelCase(testString)).toBe('helloWorldExample');
      expect(toCamelCase('kebab-case-example')).toBe('kebabCaseExample');
      expect(toCamelCase('snake_case_example')).toBe('snakeCaseExample');
    });

    it('should convert to PascalCase', () => {
      expect(toPascalCase(testString)).toBe('HelloWorldExample');
      expect(toPascalCase('kebab-case-example')).toBe('KebabCaseExample');
    });

    it('should convert to snake_case', () => {
      expect(toSnakeCase(testString)).toBe('hello_world_example');
      expect(toSnakeCase('CamelCaseExample')).toBe('camel_case_example');
      expect(toSnakeCase('kebab-case-example')).toBe('kebab_case_example');
    });

    it('should convert to kebab-case', () => {
      expect(toKebabCase(testString)).toBe('hello-world-example');
      expect(toKebabCase('CamelCaseExample')).toBe('camel-case-example');
      expect(toKebabCase('snake_case_example')).toBe('snake-case-example');
    });

    it('should convert to CONSTANT_CASE', () => {
      expect(toConstantCase(testString)).toBe('HELLO_WORLD_EXAMPLE');
      expect(toConstantCase('CamelCaseExample')).toBe('CAMEL_CASE_EXAMPLE');
    });

    it('should convert to Title Case', () => {
      expect(toTitleCase(testString)).toBe('Hello World Example');
      expect(toTitleCase('UPPERCASE TEXT')).toBe('Uppercase Text');
    });

    it('should convert to sentence case', () => {
      expect(toSentenceCase(testString)).toBe('Hello world example');
      expect(toSentenceCase('UPPERCASE TEXT')).toBe('Uppercase text');
    });
  });

  describe('convertCase', () => {
    const testString = 'hello world';

    it('should convert to all case types', () => {
      expect(convertCase(testString, 'camelCase')).toBe('helloWorld');
      expect(convertCase(testString, 'PascalCase')).toBe('HelloWorld');
      expect(convertCase(testString, 'snake_case')).toBe('hello_world');
      expect(convertCase(testString, 'kebab-case')).toBe('hello-world');
      expect(convertCase(testString, 'CONSTANT_CASE')).toBe('HELLO_WORLD');
      expect(convertCase(testString, 'Title Case')).toBe('Hello World');
      expect(convertCase(testString, 'sentence case')).toBe('Hello world');
      expect(convertCase(testString, 'UPPERCASE')).toBe('HELLO WORLD');
      expect(convertCase(testString, 'lowercase')).toBe('hello world');
    });

    it('should throw error for non-string input', () => {
      expect(() => convertCase(123 as any, 'camelCase')).toThrow('Input must be a string');
    });

    it('should throw error for unsupported case type', () => {
      expect(() => convertCase(testString, 'invalidCase' as CaseType)).toThrow('Unsupported case type');
    });
  });

  describe('getAllCaseConversions', () => {
    it('should return all case conversions', () => {
      const result = getAllCaseConversions('hello world');
      
      expect(result).toHaveProperty('camelCase', 'helloWorld');
      expect(result).toHaveProperty('PascalCase', 'HelloWorld');
      expect(result).toHaveProperty('snake_case', 'hello_world');
      expect(result).toHaveProperty('kebab-case', 'hello-world');
      expect(result).toHaveProperty('CONSTANT_CASE', 'HELLO_WORLD');
      expect(result).toHaveProperty('Title Case', 'Hello World');
      expect(result).toHaveProperty('sentence case', 'Hello world');
      expect(result).toHaveProperty('UPPERCASE', 'HELLO WORLD');
      expect(result).toHaveProperty('lowercase', 'hello world');
    });

    it('should handle edge cases gracefully', () => {
      const result = getAllCaseConversions('');
      expect(Object.keys(result)).toHaveLength(9);
      
      // Should not throw error and return fallback values
      expect(typeof result.camelCase).toBe('string');
    });
  });
});
