import { describe, it, expect } from 'vitest';
import {
  unixToIso,
  isoToUnix,
  getCurrentUnixTimestamp,
  getCurrentIsoTimestamp,
  formatTimestamp,
} from '../timestamp.js';

describe('Timestamp utilities', () => {
  describe('unixToIso', () => {
    it('should convert Unix timestamp to ISO string', () => {
      // 2023-01-01 00:00:00 UTC
      expect(unixToIso(1672531200)).toBe('2023-01-01T00:00:00.000Z');
      
      // 2024-08-17 17:39:07 UTC (corrected timestamp)
      expect(unixToIso(1723916347)).toBe('2024-08-17T17:39:07.000Z');
    });

    it('should handle millisecond timestamps', () => {
      expect(unixToIso(1672531200000)).toBe('2023-01-01T00:00:00.000Z');
    });

    it('should handle zero timestamp', () => {
      expect(unixToIso(0)).toBe('1970-01-01T00:00:00.000Z');
    });

    it('should throw error for invalid input', () => {
      expect(() => unixToIso('invalid' as any)).toThrow('Timestamp must be a number');
      expect(() => unixToIso(-1)).toThrow('Timestamp must be non-negative');
    });

    it('should throw error for invalid timestamp', () => {
      expect(() => unixToIso(Number.MAX_SAFE_INTEGER)).toThrow('Invalid timestamp');
    });
  });

  describe('isoToUnix', () => {
    it('should convert ISO string to Unix timestamp', () => {
      expect(isoToUnix('2023-01-01T00:00:00.000Z')).toBe(1672531200);
      expect(isoToUnix('2024-08-17T17:39:07.000Z')).toBe(1723916347);
    });

    it('should handle ISO strings without milliseconds', () => {
      expect(isoToUnix('2023-01-01T00:00:00Z')).toBe(1672531200);
    });

    it('should handle ISO strings with timezone', () => {
      expect(isoToUnix('2023-01-01T01:00:00+01:00')).toBe(1672531200);
    });

    it('should throw error for invalid input', () => {
      expect(() => isoToUnix(123 as any)).toThrow('Input must be a string');
      expect(() => isoToUnix('invalid')).toThrow('Invalid ISO string');
      expect(() => isoToUnix('2023-13-01T00:00:00Z')).toThrow('Invalid ISO string');
    });
  });

  describe('getCurrentUnixTimestamp', () => {
    it('should return current Unix timestamp', () => {
      const before = Math.floor(Date.now() / 1000);
      const timestamp = getCurrentUnixTimestamp();
      const after = Math.floor(Date.now() / 1000);
      
      expect(timestamp).toBeGreaterThanOrEqual(before);
      expect(timestamp).toBeLessThanOrEqual(after);
      expect(Number.isInteger(timestamp)).toBe(true);
    });
  });

  describe('getCurrentIsoTimestamp', () => {
    it('should return current ISO timestamp', () => {
      const timestamp = getCurrentIsoTimestamp();
      expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      
      // Should be valid date
      expect(new Date(timestamp).getTime()).toBeGreaterThan(0);
    });
  });

  describe('formatTimestamp', () => {
    it('should format Unix timestamp', () => {
      const formatted = formatTimestamp(1672531200);
      expect(formatted).toContain('2023');
      expect(formatted).toContain('January');
      expect(formatted).toContain('1');
    });

    it('should format ISO string', () => {
      const formatted = formatTimestamp('2023-01-01T00:00:00.000Z');
      expect(formatted).toContain('2023');
      expect(formatted).toContain('January');
      expect(formatted).toContain('1');
    });

    it('should handle millisecond timestamps', () => {
      const formatted = formatTimestamp(1672531200000);
      expect(formatted).toContain('2023');
    });

    it('should accept custom formatting options', () => {
      const formatted = formatTimestamp(1672531200, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      expect(formatted).toContain('2023');
      expect(formatted).toContain('Jan');
    });

    it('should throw error for invalid timestamp', () => {
      expect(() => formatTimestamp('invalid')).toThrow('Invalid timestamp');
      expect(() => formatTimestamp(Number.MAX_SAFE_INTEGER)).toThrow('Invalid timestamp');
    });
  });

  describe('round-trip conversion', () => {
    const testTimestamps = [
      1672531200, // 2023-01-01
      1723916347, // 2024-08-17
      0, // Epoch
    ];

    testTimestamps.forEach((timestamp) => {
      it(`should convert timestamp ${timestamp} correctly both ways`, () => {
        const iso = unixToIso(timestamp);
        const backToUnix = isoToUnix(iso);
        expect(backToUnix).toBe(timestamp);
      });
    });
  });
});
