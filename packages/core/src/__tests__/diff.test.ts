import { describe, it, expect } from 'vitest';
import { 
  diffText, 
  diffLines, 
  diffWords, 
  diffCharacters,
  createUnifiedDiff,
  createSideBySideDiff,
  type DiffMode 
} from '../diff.js';

describe('Text Diff Utilities', () => {
  describe('diffLines', () => {
    it('should detect identical texts', () => {
      const text1 = 'Hello\nWorld\nTest';
      const text2 = 'Hello\nWorld\nTest';
      const result = diffLines(text1, text2);
      
      expect(result.similarity).toBe(100);
      expect(result.stats.added).toBe(0);
      expect(result.stats.removed).toBe(0);
      expect(result.stats.unchanged).toBe(3);
    });

    it('should detect added lines', () => {
      const text1 = 'Hello\nWorld';
      const text2 = 'Hello\nWorld\nNew Line';
      const result = diffLines(text1, text2);
      
      expect(result.stats.added).toBe(1);
      expect(result.stats.removed).toBe(0);
      expect(result.stats.unchanged).toBe(2);
      expect(result.lines.some(line => line.type === 'added' && line.content === 'New Line')).toBe(true);
    });

    it('should detect removed lines', () => {
      const text1 = 'Hello\nWorld\nTest';
      const text2 = 'Hello\nWorld';
      const result = diffLines(text1, text2);
      
      expect(result.stats.added).toBe(0);
      expect(result.stats.removed).toBe(1);
      expect(result.stats.unchanged).toBe(2);
      expect(result.lines.some(line => line.type === 'removed' && line.content === 'Test')).toBe(true);
    });

    it('should detect line replacements', () => {
      const text1 = 'Hello\nOld Line\nWorld';
      const text2 = 'Hello\nNew Line\nWorld';
      const result = diffLines(text1, text2);
      
      expect(result.stats.added).toBe(1);
      expect(result.stats.removed).toBe(1);
      expect(result.stats.unchanged).toBe(2);
    });

    it('should handle empty strings', () => {
      const result1 = diffLines('', 'Hello');
      expect(result1.stats.added).toBe(1);
      expect(result1.stats.removed).toBe(0);
      
      const result2 = diffLines('Hello', '');
      expect(result2.stats.added).toBe(0);
      expect(result2.stats.removed).toBe(1);
      
      const result3 = diffLines('', '');
      expect(result3.similarity).toBe(100);
    });

    it('should throw error for non-string input', () => {
      expect(() => diffLines(null as any, 'test')).toThrow('Both inputs must be strings');
      expect(() => diffLines('test', undefined as any)).toThrow('Both inputs must be strings');
    });
  });

  describe('diffWords', () => {
    it('should detect word differences', () => {
      const text1 = 'Hello beautiful world';
      const text2 = 'Hello wonderful world';
      const result = diffWords(text1, text2);
      
      expect(result.stats.added).toBe(1);
      expect(result.stats.removed).toBe(1);
      expect(result.stats.unchanged).toBe(4); // 'Hello', ' ', 'world', plus spaces
    });

    it('should handle identical word texts', () => {
      const text = 'Hello world test';
      const result = diffWords(text, text);
      
      expect(result.similarity).toBe(100);
      expect(result.stats.unchanged).toBeGreaterThan(0);
      expect(result.stats.added).toBe(0);
      expect(result.stats.removed).toBe(0);
    });

    it('should handle word additions', () => {
      const text1 = 'Hello world';
      const text2 = 'Hello beautiful world';
      const result = diffWords(text1, text2);
      
      expect(result.stats.added).toBe(2); // 'beautiful' and ' '
      expect(result.stats.removed).toBe(0);
    });

    it('should throw error for non-string input', () => {
      expect(() => diffWords(123 as any, 'test')).toThrow('Both inputs must be strings');
    });
  });

  describe('diffCharacters', () => {
    it('should detect character differences', () => {
      const text1 = 'Hello';
      const text2 = 'Hallo';
      const result = diffCharacters(text1, text2);
      
      expect(result.stats.added).toBe(1); // 'a'
      expect(result.stats.removed).toBe(1); // 'e'
      expect(result.stats.unchanged).toBe(4); // 'H', 'l', 'l', 'o'
    });

    it('should handle identical character texts', () => {
      const text = 'Hello';
      const result = diffCharacters(text, text);
      
      expect(result.similarity).toBe(100);
      expect(result.stats.unchanged).toBe(5);
      expect(result.stats.added).toBe(0);
      expect(result.stats.removed).toBe(0);
    });

    it('should handle character insertions', () => {
      const text1 = 'Hello';
      const text2 = 'Helllo';
      const result = diffCharacters(text1, text2);
      
      expect(result.stats.added).toBe(1);
      expect(result.stats.removed).toBe(0);
      expect(result.stats.unchanged).toBe(5);
    });

    it('should throw error for non-string input', () => {
      expect(() => diffCharacters(true as any, 'test')).toThrow('Both inputs must be strings');
    });
  });

  describe('diffText (main function)', () => {
    it('should default to line mode', () => {
      const text1 = 'Hello\nWorld';
      const text2 = 'Hello\nWorld\nTest';
      const result = diffText(text1, text2);
      
      expect(result.stats.added).toBe(1);
      expect(result.stats.unchanged).toBe(2);
    });

    it('should support line mode explicitly', () => {
      const text1 = 'Hello\nWorld';
      const text2 = 'Hello\nTest';
      const result = diffText(text1, text2, 'line');
      
      expect(result.stats.added).toBe(1);
      expect(result.stats.removed).toBe(1);
      expect(result.stats.unchanged).toBe(1);
    });

    it('should support word mode', () => {
      const text1 = 'Hello world';
      const text2 = 'Hello test';
      const result = diffText(text1, text2, 'word');
      
      expect(result.stats.added).toBe(1);
      expect(result.stats.removed).toBe(1);
    });

    it('should support character mode', () => {
      const text1 = 'Hello';
      const text2 = 'Hallo';
      const result = diffText(text1, text2, 'character');
      
      expect(result.stats.added).toBe(1);
      expect(result.stats.removed).toBe(1);
      expect(result.stats.unchanged).toBe(4);
    });

    it('should throw error for invalid mode', () => {
      expect(() => diffText('hello', 'world', 'invalid' as DiffMode))
        .toThrow('Unsupported diff mode: invalid');
    });
  });

  describe('createUnifiedDiff', () => {
    it('should create proper unified diff format', () => {
      const text1 = 'Hello\nWorld\nTest';
      const text2 = 'Hello\nUniverse\nTest';
      const unified = createUnifiedDiff(text1, text2, 'file1.txt', 'file2.txt');
      
      expect(unified).toContain('--- file1.txt');
      expect(unified).toContain('+++ file2.txt');
      expect(unified).toContain('-World');
      expect(unified).toContain('+Universe');
      expect(unified).toContain(' Hello');
      expect(unified).toContain(' Test');
    });

    it('should use default filenames', () => {
      const text1 = 'Hello';
      const text2 = 'World';
      const unified = createUnifiedDiff(text1, text2);
      
      expect(unified).toContain('--- original');
      expect(unified).toContain('+++ modified');
    });

    it('should handle empty texts', () => {
      const unified = createUnifiedDiff('', 'Hello');
      expect(unified).toContain('+Hello');
      
      const unified2 = createUnifiedDiff('Hello', '');
      expect(unified2).toContain('-Hello');
    });
  });

  describe('createSideBySideDiff', () => {
    it('should create side-by-side diff format', () => {
      const text1 = 'Hello\nWorld';
      const text2 = 'Hello\nUniverse';
      const sideBySide = createSideBySideDiff(text1, text2);
      
      expect(sideBySide).toHaveLength(3); // Hello (unchanged), World (removed), Universe (added)
      
      // Find the unchanged line
      const unchangedLine = sideBySide.find(line => 
        line.original[0] === 'Hello' && line.modified[0] === 'Hello'
      );
      expect(unchangedLine).toBeDefined();
      
      // Find the removed line
      const removedLine = sideBySide.find(line => 
        line.original[0] === 'World' && line.modified[0] === ''
      );
      expect(removedLine).toBeDefined();
      
      // Find the added line
      const addedLine = sideBySide.find(line => 
        line.original[0] === '' && line.modified[0] === 'Universe'
      );
      expect(addedLine).toBeDefined();
    });

    it('should handle identical texts', () => {
      const text = 'Hello\nWorld';
      const sideBySide = createSideBySideDiff(text, text);
      
      expect(sideBySide).toHaveLength(2);
      sideBySide.forEach(line => {
        expect(line.original[0]).toBe(line.modified[0]);
      });
    });

    it('should handle empty texts', () => {
      const sideBySide1 = createSideBySideDiff('', 'Hello');
      expect(sideBySide1).toHaveLength(1);
      expect(sideBySide1[0].original[0]).toBe('');
      expect(sideBySide1[0].modified[0]).toBe('Hello');
      
      const sideBySide2 = createSideBySideDiff('Hello', '');
      expect(sideBySide2).toHaveLength(1);
      expect(sideBySide2[0].original[0]).toBe('Hello');
      expect(sideBySide2[0].modified[0]).toBe('');
    });
  });

  describe('similarity calculation', () => {
    it('should calculate 100% similarity for identical texts', () => {
      const result = diffLines('Hello World', 'Hello World');
      expect(result.similarity).toBe(100);
    });

    it('should calculate 0% similarity for completely different texts', () => {
      const result = diffLines('Hello', 'XYZ');
      expect(result.similarity).toBe(0);
    });

    it('should calculate partial similarity', () => {
      const result = diffLines('Hello', 'Hallo');
      expect(result.similarity).toBeGreaterThan(0);
      expect(result.similarity).toBeLessThan(100);
    });

    it('should handle empty string comparison', () => {
      const result1 = diffLines('', '');
      expect(result1.similarity).toBe(100);
      
      const result2 = diffLines('', 'Hello');
      expect(result2.similarity).toBe(0);
      
      const result3 = diffLines('Hello', '');
      expect(result3.similarity).toBe(0);
    });
  });

  describe('edge cases', () => {
    it('should handle texts with only whitespace', () => {
      const result = diffLines('   \n\t\n  ', '   \n\n  ');
      expect(result.stats).toBeDefined();
      expect(result.similarity).toBeDefined();
    });

    it('should handle texts with special characters', () => {
      const text1 = 'Hello 🌍\n@#$%^&*()';
      const text2 = 'Hello 🌎\n@#$%^&*()';
      const result = diffLines(text1, text2);
      
      expect(result.stats.added).toBe(1);
      expect(result.stats.removed).toBe(1);
      expect(result.stats.unchanged).toBe(1);
    });

    it('should handle very large line numbers', () => {
      const largeText1 = Array(1000).fill('line').join('\n');
      const largeText2 = Array(1000).fill('line').join('\n') + '\nnew line';
      const result = diffLines(largeText1, largeText2);
      
      expect(result.stats.added).toBe(1);
      expect(result.stats.unchanged).toBe(1000);
    });

    it('should handle Unicode characters correctly', () => {
      const text1 = 'Hello 世界';
      const text2 = 'Hello 世界!';
      const result = diffCharacters(text1, text2);
      
      expect(result.stats.added).toBe(1);
      expect(result.stats.unchanged).toBe(8); // 'H', 'e', 'l', 'l', 'o', ' ', '世', '界'
    });
  });
});
