import { describe, it, expect } from 'vitest';
import { validateJson, formatJson, minifyJson } from '../json.js';

describe('JSON utilities', () => {
  describe('validateJson', () => {
    it('should validate correct JSON', () => {
      const result = validateJson('{"name": "test"}');
      expect(result.isValid).toBe(true);
      expect(result.data).toEqual({ name: 'test' });
      expect(result.error).toBeUndefined();
    });

    it('should validate arrays', () => {
      const result = validateJson('[1, 2, 3]');
      expect(result.isValid).toBe(true);
      expect(result.data).toEqual([1, 2, 3]);
    });

    it('should validate primitives', () => {
      expect(validateJson('true').isValid).toBe(true);
      expect(validateJson('null').isValid).toBe(true);
      expect(validateJson('123').isValid).toBe(true);
      expect(validateJson('"string"').isValid).toBe(true);
    });

    it('should invalidate malformed JSON', () => {
      const result = validateJson('{"name": test}'); // missing quotes
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Unexpected token');
      expect(result.data).toBeUndefined();
    });

    it('should handle empty input', () => {
      const result = validateJson('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Input cannot be empty');
    });

    it('should handle whitespace-only input', () => {
      const result = validateJson('   ');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Input cannot be empty');
    });

    it('should handle non-string input', () => {
      const result = validateJson(123 as any);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Input must be a string');
    });
  });

  describe('formatJson', () => {
    it('should format valid JSON with default indentation', () => {
      const input = '{"name":"test","value":123}';
      const expected = '{\n  "name": "test",\n  "value": 123\n}';
      expect(formatJson(input)).toBe(expected);
    });

    it('should format with custom indentation', () => {
      const input = '{"name":"test"}';
      const expected = '{\n    "name": "test"\n}';
      expect(formatJson(input, 4)).toBe(expected);
    });

    it('should format arrays', () => {
      const input = '[1,2,3]';
      const expected = '[\n  1,\n  2,\n  3\n]';
      expect(formatJson(input)).toBe(expected);
    });

    it('should throw error for invalid JSON', () => {
      expect(() => formatJson('{"invalid": }')).toThrow();
    });
  });

  describe('minifyJson', () => {
    it('should minify formatted JSON', () => {
      const input = '{\n  "name": "test",\n  "value": 123\n}';
      const expected = '{"name":"test","value":123}';
      expect(minifyJson(input)).toBe(expected);
    });

    it('should minify arrays', () => {
      const input = '[\n  1,\n  2,\n  3\n]';
      const expected = '[1,2,3]';
      expect(minifyJson(input)).toBe(expected);
    });

    it('should handle already minified JSON', () => {
      const input = '{"name":"test"}';
      expect(minifyJson(input)).toBe(input);
    });

    it('should throw error for invalid JSON', () => {
      expect(() => minifyJson('{"invalid": }')).toThrow();
    });
  });

  describe('round-trip formatting', () => {
    const testObjects = [
      { name: 'test', value: 123 },
      [1, 2, 3, { nested: true }],
      { complex: { nested: { object: 'value' } } },
      true,
      null,
      'string',
    ];

    testObjects.forEach((obj) => {
      it(`should format and minify object correctly`, () => {
        const original = JSON.stringify(obj);
        const formatted = formatJson(original);
        const minified = minifyJson(formatted);
        expect(minified).toBe(original);
      });
    });
  });
});
