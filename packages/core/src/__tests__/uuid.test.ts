import { describe, it, expect } from 'vitest';
import {
  generateUuidV4,
  isValidUuid,
  generateMultipleUuids,
} from '../uuid.js';

describe('UUID utilities', () => {
  describe('generateUuidV4', () => {
    it('should generate valid UUID v4', () => {
      const uuid = generateUuidV4();
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should generate unique UUIDs', () => {
      const uuid1 = generateUuidV4();
      const uuid2 = generateUuidV4();
      expect(uuid1).not.toBe(uuid2);
    });

    it('should generate UUIDs with correct format', () => {
      const uuid = generateUuidV4();
      const parts = uuid.split('-');
      expect(parts).toHaveLength(5);
      expect(parts[0]).toHaveLength(8);
      expect(parts[1]).toHaveLength(4);
      expect(parts[2]).toHaveLength(4);
      expect(parts[3]).toHaveLength(4);
      expect(parts[4]).toHaveLength(12);
    });

    it('should generate UUID with version 4', () => {
      const uuid = generateUuidV4();
      const versionChar = uuid.charAt(14); // Position of version in UUID
      expect(versionChar).toBe('4');
    });

    it('should generate UUID with correct variant', () => {
      const uuid = generateUuidV4();
      const variantChar = uuid.charAt(19); // Position of variant in UUID
      expect(['8', '9', 'a', 'b', 'A', 'B']).toContain(variantChar);
    });
  });

  describe('isValidUuid', () => {
    it('should validate correct UUIDs', () => {
      const uuid = generateUuidV4();
      expect(isValidUuid(uuid)).toBe(true);
      
      // Test with known valid UUIDs
      expect(isValidUuid('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
      expect(isValidUuid('6ba7b810-9dad-11d1-80b4-00c04fd430c8')).toBe(true);
    });

    it('should invalidate incorrect UUIDs', () => {
      expect(isValidUuid('invalid')).toBe(false);
      expect(isValidUuid('550e8400-e29b-41d4-a716')).toBe(false); // Too short
      expect(isValidUuid('550e8400-e29b-41d4-a716-446655440000-extra')).toBe(false); // Too long
      expect(isValidUuid('550e8400-e29b-41d4-g716-446655440000')).toBe(false); // Invalid char
      expect(isValidUuid('550e8400e29b41d4a716446655440000')).toBe(false); // No dashes
    });

    it('should handle edge cases', () => {
      expect(isValidUuid('')).toBe(false);
      expect(isValidUuid('00000000-0000-0000-0000-000000000000')).toBe(false); // Version 0
      expect(isValidUuid('00000000-0000-6000-8000-000000000000')).toBe(false); // Version 6
    });

    it('should handle non-string input', () => {
      expect(isValidUuid(123 as any)).toBe(false);
      expect(isValidUuid(null as any)).toBe(false);
      expect(isValidUuid(undefined as any)).toBe(false);
    });

    it('should be case insensitive', () => {
      expect(isValidUuid('550E8400-E29B-41D4-A716-446655440000')).toBe(true);
      expect(isValidUuid('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
    });
  });

  describe('generateMultipleUuids', () => {
    it('should generate correct number of UUIDs', () => {
      const uuids = generateMultipleUuids(5);
      expect(uuids).toHaveLength(5);
      
      // All should be valid UUIDs
      uuids.forEach(uuid => {
        expect(isValidUuid(uuid)).toBe(true);
      });
    });

    it('should generate unique UUIDs', () => {
      const uuids = generateMultipleUuids(10);
      const uniqueUuids = new Set(uuids);
      expect(uniqueUuids.size).toBe(10);
    });

    it('should handle single UUID generation', () => {
      const uuids = generateMultipleUuids(1);
      expect(uuids).toHaveLength(1);
      expect(isValidUuid(uuids[0])).toBe(true);
    });

    it('should throw error for invalid count', () => {
      expect(() => generateMultipleUuids(0)).toThrow('Count must be a positive integer');
      expect(() => generateMultipleUuids(-1)).toThrow('Count must be a positive integer');
      expect(() => generateMultipleUuids(1.5)).toThrow('Count must be a positive integer');
      expect(() => generateMultipleUuids('5' as any)).toThrow('Count must be a positive integer');
    });

    it('should throw error for excessive count', () => {
      expect(() => generateMultipleUuids(1001)).toThrow('Count cannot exceed 1000');
    });

    it('should handle maximum allowed count', () => {
      const uuids = generateMultipleUuids(1000);
      expect(uuids).toHaveLength(1000);
      
      // Verify uniqueness (at least for a sample)
      const sample = uuids.slice(0, 100);
      const uniqueSample = new Set(sample);
      expect(uniqueSample.size).toBe(100);
    });
  });

  describe('UUID quality tests', () => {
    it('should generate UUIDs with good entropy', () => {
      const uuids = generateMultipleUuids(100);
      
      // Check that we don't have obviously poor entropy
      const firstChars = uuids.map(uuid => uuid.charAt(0));
      const uniqueFirstChars = new Set(firstChars);
      
      // Should have reasonable distribution of first characters
      expect(uniqueFirstChars.size).toBeGreaterThan(5);
    });

    it('should maintain consistent format across generations', () => {
      const uuids = generateMultipleUuids(50);
      
      uuids.forEach(uuid => {
        expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
        expect(isValidUuid(uuid)).toBe(true);
      });
    });
  });
});
