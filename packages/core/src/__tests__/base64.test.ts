import { describe, it, expect } from 'vitest';
import { encodeBase64, decodeBase64 } from '../base64.js';

describe('Base64 utilities', () => {
  describe('encodeBase64', () => {
    it('should encode simple ASCII strings', () => {
      expect(encodeBase64('hello')).toBe('aGVsbG8=');
      expect(encodeBase64('Hello World')).toBe('SGVsbG8gV29ybGQ=');
      expect(encodeBase64('')).toBe('');
    });

    it('should encode Unicode strings correctly', () => {
      expect(encodeBase64('Hello 🌍')).toBe('SGVsbG8g8J+MjQ==');
      expect(encodeBase64('café')).toBe('Y2Fmw6k=');
    });

    it('should throw error for non-string input', () => {
      expect(() => encodeBase64(123 as any)).toThrow('Input must be a string');
      expect(() => encodeBase64(null as any)).toThrow('Input must be a string');
    });
  });

  describe('decodeBase64', () => {
    it('should decode valid Base64 strings', () => {
      expect(decodeBase64('aGVsbG8=')).toBe('hello');
      expect(decodeBase64('SGVsbG8gV29ybGQ=')).toBe('Hello World');
      expect(decodeBase64('')).toBe('');
    });

    it('should decode Unicode strings correctly', () => {
      expect(decodeBase64('SGVsbG8g8J+MjQ==')).toBe('Hello 🌍');
      expect(decodeBase64('Y2Fmw6k=')).toBe('café');
    });

    it('should throw error for invalid Base64', () => {
      expect(() => decodeBase64('invalid!')).toThrow('Invalid Base64 string');
      // Note: 'SGVsbG8=' is actually valid Base64 for 'Hello'
      expect(() => decodeBase64('!!!invalid!!!')).toThrow('Invalid Base64 string');
    });

    it('should throw error for non-string input', () => {
      expect(() => decodeBase64(123 as any)).toThrow('Input must be a string');
    });
  });

  describe('round-trip encoding/decoding', () => {
    const testStrings = [
      'hello world',
      'Hello 🌍',
      'café',
      '{"name": "test", "value": 123}',
      'Line 1\nLine 2\nLine 3',
      '!@#$%^&*()_+-=[]{}|;:,.<>?',
    ];

    testStrings.forEach((str) => {
      it(`should encode and decode "${str}" correctly`, () => {
        const encoded = encodeBase64(str);
        const decoded = decodeBase64(encoded);
        expect(decoded).toBe(str);
      });
    });
  });
});
