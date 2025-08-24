import { describe, it, expect } from 'vitest';
import {
  hexToAscii,
  asciiToHex,
  hexToBinary,
  binaryToHex,
  hexToDecimal,
  decimalToHex,
} from '../hex.js';

describe('Hex utilities', () => {
  describe('hexToAscii', () => {
    it('should convert hex to ASCII', () => {
      expect(hexToAscii('48656C6C6F')).toBe('Hello');
      expect(hexToAscii('576F726C64')).toBe('World');
      expect(hexToAscii('4869')).toBe('Hi');
    });

    it('should handle lowercase hex', () => {
      expect(hexToAscii('48656c6c6f')).toBe('Hello');
    });

    it('should handle hex with spaces', () => {
      expect(hexToAscii('48 65 6C 6C 6F')).toBe('Hello');
    });

    it('should handle empty string', () => {
      expect(hexToAscii('')).toBe('');
    });

    it('should throw error for invalid hex', () => {
      expect(() => hexToAscii('GG')).toThrow('Invalid hexadecimal string');
      expect(() => hexToAscii('12G')).toThrow('Invalid hexadecimal string');
    });

    it('should throw error for odd length hex', () => {
      expect(() => hexToAscii('123')).toThrow('Hexadecimal string must have even length');
    });

    it('should throw error for non-string input', () => {
      expect(() => hexToAscii(123 as any)).toThrow('Input must be a string');
    });
  });

  describe('asciiToHex', () => {
    it('should convert ASCII to hex', () => {
      expect(asciiToHex('Hello')).toBe('48656C6C6F');
      expect(asciiToHex('World')).toBe('576F726C64');
      expect(asciiToHex('Hi')).toBe('4869');
    });

    it('should handle empty string', () => {
      expect(asciiToHex('')).toBe('');
    });

    it('should handle special characters', () => {
      expect(asciiToHex('!')).toBe('21');
      expect(asciiToHex('@')).toBe('40');
    });

    it('should throw error for non-string input', () => {
      expect(() => asciiToHex(123 as any)).toThrow('Input must be a string');
    });
  });

  describe('hexToBinary', () => {
    it('should convert hex to binary', () => {
      expect(hexToBinary('A')).toBe('1010');
      expect(hexToBinary('F')).toBe('1111');
      expect(hexToBinary('10')).toBe('00010000');
      expect(hexToBinary('FF')).toBe('11111111');
    });

    it('should handle lowercase hex', () => {
      expect(hexToBinary('a')).toBe('1010');
      expect(hexToBinary('ff')).toBe('11111111');
    });

    it('should handle empty string', () => {
      expect(hexToBinary('')).toBe('');
    });

    it('should throw error for invalid hex', () => {
      expect(() => hexToBinary('G')).toThrow('Invalid hexadecimal string');
    });
  });

  describe('binaryToHex', () => {
    it('should convert binary to hex', () => {
      expect(binaryToHex('1010')).toBe('A');
      expect(binaryToHex('1111')).toBe('F');
      expect(binaryToHex('00010000')).toBe('10');
      expect(binaryToHex('11111111')).toBe('FF');
    });

    it('should handle padding', () => {
      expect(binaryToHex('1')).toBe('1');
      expect(binaryToHex('10')).toBe('2');
      expect(binaryToHex('101')).toBe('5');
    });

    it('should handle empty string', () => {
      expect(binaryToHex('')).toBe('');
    });

    it('should throw error for invalid binary', () => {
      expect(() => binaryToHex('102')).toThrow('Invalid binary string');
      expect(() => binaryToHex('abc')).toThrow('Invalid binary string');
    });
  });

  describe('hexToDecimal', () => {
    it('should convert hex to decimal', () => {
      expect(hexToDecimal('A')).toBe(10);
      expect(hexToDecimal('F')).toBe(15);
      expect(hexToDecimal('10')).toBe(16);
      expect(hexToDecimal('FF')).toBe(255);
      expect(hexToDecimal('100')).toBe(256);
    });

    it('should handle lowercase hex', () => {
      expect(hexToDecimal('a')).toBe(10);
      expect(hexToDecimal('ff')).toBe(255);
    });

    it('should handle empty string', () => {
      expect(hexToDecimal('')).toBe(0);
    });

    it('should throw error for invalid hex', () => {
      expect(() => hexToDecimal('G')).toThrow('Invalid hexadecimal string');
    });
  });

  describe('decimalToHex', () => {
    it('should convert decimal to hex', () => {
      expect(decimalToHex(10)).toBe('A');
      expect(decimalToHex(15)).toBe('F');
      expect(decimalToHex(16)).toBe('10');
      expect(decimalToHex(255)).toBe('FF');
      expect(decimalToHex(256)).toBe('100');
    });

    it('should handle zero', () => {
      expect(decimalToHex(0)).toBe('0');
    });

    it('should throw error for non-integer', () => {
      expect(() => decimalToHex(10.5)).toThrow('Input must be an integer');
      expect(() => decimalToHex('10' as any)).toThrow('Input must be an integer');
    });

    it('should throw error for negative numbers', () => {
      expect(() => decimalToHex(-1)).toThrow('Input must be a non-negative integer');
    });
  });

  describe('round-trip conversions', () => {
    const testCases = [
      { ascii: 'Hello', hex: '48656C6C6F' },
      { ascii: 'World', hex: '576F726C64' },
      { ascii: '!@#', hex: '214023' },
    ];

    testCases.forEach(({ ascii, hex }) => {
      it(`should convert "${ascii}" correctly both ways`, () => {
        expect(asciiToHex(ascii)).toBe(hex);
        expect(hexToAscii(hex)).toBe(ascii);
      });
    });

    const hexDecimalCases = [
      { hex: 'A', decimal: 10 },
      { hex: 'FF', decimal: 255 },
      { hex: '100', decimal: 256 },
    ];

    hexDecimalCases.forEach(({ hex, decimal }) => {
      it(`should convert ${hex} <-> ${decimal} correctly`, () => {
        expect(hexToDecimal(hex)).toBe(decimal);
        expect(decimalToHex(decimal)).toBe(hex);
      });
    });
  });
});
