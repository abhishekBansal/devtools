import { describe, it, expect } from 'vitest';
import {
  validateXml,
  formatXml,
  minifyXml,
  analyzeXml,
} from '../src/xml.js';

describe('xml utilities', () => {
  describe('validateXml', () => {
    it('should validate correct XML', () => {
      const validXml = '<?xml version="1.0"?><root><item>value</item></root>';
      const result = validateXml(validXml);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should detect invalid XML', () => {
      const invalidXml = '<root><item>value</root>';
      const result = validateXml(invalidXml);
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle empty or null input', () => {
      expect(validateXml('')).toEqual({ valid: false, error: 'XML string is required' });
      expect(validateXml(null as any)).toEqual({ valid: false, error: 'XML string is required' });
    });

    it('should validate self-closing tags', () => {
      const xml = '<root><item/></root>';
      const result = validateXml(xml);
      expect(result.valid).toBe(true);
    });
  });

  describe('formatXml', () => {
    it('should format simple XML', () => {
      const xml = '<root><item>value</item></root>';
      const formatted = formatXml(xml);
      
      expect(formatted).toContain('<root>');
      expect(formatted).toContain('  <item>');
      expect(formatted).toContain('    value');
      expect(formatted).toContain('  </item>');
      expect(formatted).toContain('</root>');
    });

    it('should handle custom indentation', () => {
      const xml = '<root><item>value</item></root>';
      const formatted = formatXml(xml, 4);
      
      expect(formatted).toContain('    <item>');
      expect(formatted).toContain('        value');
      expect(formatted).toContain('    </item>');
    });

    it('should format nested XML', () => {
      const xml = '<root><parent><child>value</child></parent></root>';
      const formatted = formatXml(xml);
      
      const lines = formatted.split('\n').filter(line => line.trim()); // Remove empty lines
      expect(lines).toHaveLength(7);
      expect(lines[0]).toBe('<root>');
      expect(lines[1]).toBe('  <parent>');
      expect(lines[2]).toBe('    <child>');
      expect(lines[3]).toBe('      value');
      expect(lines[4]).toBe('    </child>');
      expect(lines[5]).toBe('  </parent>');
      expect(lines[6]).toBe('</root>');
    });

    it('should handle XML declarations', () => {
      const xml = '<?xml version="1.0"?><root><item>value</item></root>';
      const formatted = formatXml(xml);
      
      expect(formatted).toContain('<?xml version="1.0"?>');
    });

    it('should throw error for invalid XML', () => {
      const invalidXml = '<root><item>value</root>';
      expect(() => formatXml(invalidXml)).toThrow('Invalid XML');
    });

    it('should throw error for empty input', () => {
      expect(() => formatXml('')).toThrow('XML string is required');
    });
  });

  describe('minifyXml', () => {
    it('should minify XML by removing whitespace', () => {
      const xml = `<?xml version="1.0"?>
      <root>
        <item>value</item>
        <item2>value2</item2>
      </root>`;
      
      const minified = minifyXml(xml);
      expect(minified).toBe('<?xml version="1.0"?><root><item>value</item><item2>value2</item2></root>');
    });

    it('should preserve text content', () => {
      const xml = '<root><item>hello world</item></root>';
      const minified = minifyXml(xml);
      expect(minified).toBe('<root><item>hello world</item></root>');
    });

    it('should throw error for invalid XML', () => {
      const invalidXml = '<root><item>value</root>';
      expect(() => minifyXml(invalidXml)).toThrow('Invalid XML');
    });
  });

  describe('analyzeXml', () => {
    it('should analyze simple XML structure', () => {
      const xml = '<root><item id="1">value</item><item id="2">value2</item></root>';
      const analysis = analyzeXml(xml);
      
      expect(analysis.elements).toBe(3); // root + 2 items
      expect(analysis.attributes).toBe(2); // 2 id attributes
      expect(analysis.textNodes).toBe(1); // text nodes count
      expect(analysis.comments).toBe(0);
      expect(analysis.depth).toBeGreaterThan(0);
    });

    it('should count comments', () => {
      const xml = '<root><!-- comment --><item>value</item></root>';
      const analysis = analyzeXml(xml);
      
      expect(analysis.comments).toBe(1);
    });

    it('should calculate depth correctly', () => {
      const xml = '<root><level1><level2><level3>deep</level3></level2></level1></root>';
      const analysis = analyzeXml(xml);
      
      expect(analysis.depth).toBeGreaterThanOrEqual(3);
    });

    it('should handle empty elements', () => {
      const xml = '<root><empty/></root>';
      const analysis = analyzeXml(xml);
      
      expect(analysis.elements).toBe(2);
      expect(analysis.textNodes).toBe(0);
    });

    it('should throw error for invalid XML', () => {
      const invalidXml = '<root><item>value</root>';
      expect(() => analyzeXml(invalidXml)).toThrow('Invalid XML');
    });
  });
});
