import { describe, it, expect } from 'vitest';
import {
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
} from '../src/color.js';

describe('color utilities', () => {
  describe('validateHexColor', () => {
    it('should validate and normalize hex colors', () => {
      expect(validateHexColor('#FF0000')).toBe('#FF0000');
      expect(validateHexColor('FF0000')).toBe('#FF0000');
      expect(validateHexColor('#f00')).toBe('#FF0000');
      expect(validateHexColor('f00')).toBe('#FF0000');
    });

    it('should throw error for invalid hex colors', () => {
      expect(() => validateHexColor('')).toThrow('Hex color string is required');
      expect(() => validateHexColor('invalid')).toThrow('Invalid hex color format');
      expect(() => validateHexColor('#GG0000')).toThrow('Invalid hex color format');
    });
  });

  describe('validateRgbColor', () => {
    it('should validate RGB values', () => {
      expect(validateRgbColor(255, 0, 0)).toEqual({ r: 255, g: 0, b: 0 });
      expect(validateRgbColor(0, 255, 0)).toEqual({ r: 0, g: 255, b: 0 });
      expect(validateRgbColor(0, 0, 255)).toEqual({ r: 0, g: 0, b: 255 });
    });

    it('should round decimal values', () => {
      expect(validateRgbColor(255.7, 0.3, 0.9)).toEqual({ r: 256, g: 0, b: 1 });
    });

    it('should throw error for invalid RGB values', () => {
      expect(() => validateRgbColor(-1, 0, 0)).toThrow('RGB values must be between 0 and 255');
      expect(() => validateRgbColor(256, 0, 0)).toThrow('RGB values must be between 0 and 255');
      expect(() => validateRgbColor('red' as any, 0, 0)).toThrow('RGB values must be numbers');
    });
  });

  describe('hexToRgb', () => {
    it('should convert hex to RGB', () => {
      expect(hexToRgb('#FF0000')).toEqual({ r: 255, g: 0, b: 0 });
      expect(hexToRgb('#00FF00')).toEqual({ r: 0, g: 255, b: 0 });
      expect(hexToRgb('#0000FF')).toEqual({ r: 0, g: 0, b: 255 });
      expect(hexToRgb('#FFFFFF')).toEqual({ r: 255, g: 255, b: 255 });
      expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 });
    });

    it('should handle 3-digit hex colors', () => {
      expect(hexToRgb('#F00')).toEqual({ r: 255, g: 0, b: 0 });
      expect(hexToRgb('0F0')).toEqual({ r: 0, g: 255, b: 0 });
    });
  });

  describe('rgbToHex', () => {
    it('should convert RGB to hex', () => {
      expect(rgbToHex(255, 0, 0)).toBe('#FF0000');
      expect(rgbToHex(0, 255, 0)).toBe('#00FF00');
      expect(rgbToHex(0, 0, 255)).toBe('#0000FF');
      expect(rgbToHex(255, 255, 255)).toBe('#FFFFFF');
      expect(rgbToHex(0, 0, 0)).toBe('#000000');
    });

    it('should handle single digit hex values', () => {
      expect(rgbToHex(15, 15, 15)).toBe('#0F0F0F');
    });
  });

  describe('rgbToHsl', () => {
    it('should convert RGB to HSL', () => {
      expect(rgbToHsl(255, 0, 0)).toEqual({ h: 0, s: 100, l: 50 });
      expect(rgbToHsl(0, 255, 0)).toEqual({ h: 120, s: 100, l: 50 });
      expect(rgbToHsl(0, 0, 255)).toEqual({ h: 240, s: 100, l: 50 });
      expect(rgbToHsl(255, 255, 255)).toEqual({ h: 0, s: 0, l: 100 });
      expect(rgbToHsl(0, 0, 0)).toEqual({ h: 0, s: 0, l: 0 });
    });
  });

  describe('hslToRgb', () => {
    it('should convert HSL to RGB', () => {
      expect(hslToRgb(0, 100, 50)).toEqual({ r: 255, g: 0, b: 0 });
      expect(hslToRgb(120, 100, 50)).toEqual({ r: 0, g: 255, b: 0 });
      expect(hslToRgb(240, 100, 50)).toEqual({ r: 0, g: 0, b: 255 });
    });

    it('should throw error for out of range values', () => {
      expect(() => hslToRgb(361, 50, 50)).toThrow('HSL values out of range');
      expect(() => hslToRgb(180, 101, 50)).toThrow('HSL values out of range');
      expect(() => hslToRgb(180, 50, 101)).toThrow('HSL values out of range');
    });
  });

  describe('rgbToHsv', () => {
    it('should convert RGB to HSV', () => {
      expect(rgbToHsv(255, 0, 0)).toEqual({ h: 0, s: 100, v: 100 });
      expect(rgbToHsv(0, 255, 0)).toEqual({ h: 120, s: 100, v: 100 });
      expect(rgbToHsv(0, 0, 255)).toEqual({ h: 240, s: 100, v: 100 });
      expect(rgbToHsv(0, 0, 0)).toEqual({ h: 0, s: 0, v: 0 });
    });
  });

  describe('rgbToCmyk', () => {
    it('should convert RGB to CMYK', () => {
      expect(rgbToCmyk(255, 0, 0)).toEqual({ c: 0, m: 100, y: 100, k: 0 });
      expect(rgbToCmyk(0, 255, 0)).toEqual({ c: 100, m: 0, y: 100, k: 0 });
      expect(rgbToCmyk(0, 0, 255)).toEqual({ c: 100, m: 100, y: 0, k: 0 });
      expect(rgbToCmyk(0, 0, 0)).toEqual({ c: 0, m: 0, y: 0, k: 100 });
      expect(rgbToCmyk(255, 255, 255)).toEqual({ c: 0, m: 0, y: 0, k: 0 });
    });
  });

  describe('cmykToRgb', () => {
    it('should convert CMYK to RGB', () => {
      expect(cmykToRgb(0, 100, 100, 0)).toEqual({ r: 255, g: 0, b: 0 });
      expect(cmykToRgb(100, 0, 100, 0)).toEqual({ r: 0, g: 255, b: 0 });
      expect(cmykToRgb(100, 100, 0, 0)).toEqual({ r: 0, g: 0, b: 255 });
      expect(cmykToRgb(0, 0, 0, 100)).toEqual({ r: 0, g: 0, b: 0 });
    });

    it('should throw error for out of range values', () => {
      expect(() => cmykToRgb(-1, 0, 0, 0)).toThrow('CMYK values must be between 0 and 100');
      expect(() => cmykToRgb(101, 0, 0, 0)).toThrow('CMYK values must be between 0 and 100');
    });
  });

  describe('calculateLuminance', () => {
    it('should calculate luminance correctly', () => {
      const whiteLuminance = calculateLuminance(255, 255, 255);
      const blackLuminance = calculateLuminance(0, 0, 0);
      
      expect(whiteLuminance).toBeCloseTo(1, 1);
      expect(blackLuminance).toBeCloseTo(0, 1);
      expect(whiteLuminance).toBeGreaterThan(blackLuminance);
    });
  });

  describe('calculateContrastRatio', () => {
    it('should calculate contrast ratio', () => {
      const whiteContrast = calculateContrastRatio(1, 0);
      expect(whiteContrast).toBe(21); // Perfect contrast ratio
      
      const sameColorContrast = calculateContrastRatio(0.5, 0.5);
      expect(sameColorContrast).toBe(1); // No contrast
    });
  });

  describe('analyzeColor', () => {
    it('should analyze color from hex string', () => {
      const analysis = analyzeColor('#FF0000');
      
      expect(analysis.hex).toBe('#FF0000');
      expect(analysis.rgb).toEqual({ r: 255, g: 0, b: 0 });
      expect(analysis.hsl.h).toBe(0);
      expect(analysis.hsl.s).toBe(100);
      expect(analysis.cmyk.m).toBe(100);
      expect(analysis.luminance).toBeGreaterThan(0);
      expect(analysis.contrast.white).toBeGreaterThan(0);
      expect(analysis.contrast.black).toBeGreaterThan(0);
      expect(typeof analysis.accessibility.aa).toBe('boolean');
      expect(typeof analysis.accessibility.aaa).toBe('boolean');
    });

    it('should analyze color from RGB object', () => {
      const analysis = analyzeColor({ r: 0, g: 255, b: 0 });
      
      expect(analysis.hex).toBe('#00FF00');
      expect(analysis.rgb).toEqual({ r: 0, g: 255, b: 0 });
      expect(analysis.hsl.h).toBe(120);
    });

    it('should provide accessibility information', () => {
      const whiteAnalysis = analyzeColor('#FFFFFF');
      const blackAnalysis = analyzeColor('#000000');
      
      // White should have good contrast with black text
      expect(whiteAnalysis.contrast.black).toBeGreaterThan(4.5);
      // Black should have good contrast with white text
      expect(blackAnalysis.contrast.white).toBeGreaterThan(4.5);
    });
  });
});
