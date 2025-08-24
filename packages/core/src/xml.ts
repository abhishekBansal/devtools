/**
 * XML formatting utilities for pretty-printing and validation
 */

export interface XmlValidationResult {
  valid: boolean;
  error?: string;
  line?: number;
  column?: number;
}

/**
 * Validates XML syntax
 */
export function validateXml(xmlString: string): XmlValidationResult {
  if (!xmlString || typeof xmlString !== 'string') {
    return { valid: false, error: 'XML string is required' };
  }

  try {
    // Check if we're in a browser environment
    if (typeof DOMParser !== 'undefined') {
      // Browser environment - use DOMParser
      const parser = new DOMParser();
      const doc = parser.parseFromString(xmlString.trim(), 'text/xml');
      
      // Check for parsing errors
      const parserError = doc.querySelector('parsererror');
      if (parserError) {
        const errorText = parserError.textContent || 'Unknown XML parsing error';
        return { valid: false, error: errorText };
      }

      return { valid: true };
    } else {
      // Node.js environment - use basic XML validation
      return basicXmlValidation(xmlString);
    }
  } catch (error) {
    return { 
      valid: false, 
      error: error instanceof Error ? error.message : 'XML validation failed' 
    };
  }
}

/**
 * Basic XML validation for Node.js environment
 */
function basicXmlValidation(xmlString: string): XmlValidationResult {
  const trimmed = xmlString.trim();
  
  // Check if it starts and ends with XML tags
  if (!trimmed.startsWith('<') || !trimmed.endsWith('>')) {
    return { valid: false, error: 'XML must start with < and end with >' };
  }

  // Basic tag matching check
  const tagStack: string[] = [];
  const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9]*)[^>]*>/g;
  let match;

  while ((match = tagRegex.exec(trimmed)) !== null) {
    const fullTag = match[0];
    const tagName = match[1];

    if (fullTag.startsWith('</')) {
      // Closing tag
      const lastOpenTag = tagStack.pop();
      if (lastOpenTag !== tagName) {
        return { 
          valid: false, 
          error: `Mismatched closing tag: expected </${lastOpenTag || '?'}> but found </${tagName}>` 
        };
      }
    } else if (!fullTag.endsWith('/>')) {
      // Opening tag (not self-closing)
      tagStack.push(tagName);
    }
    // Self-closing tags (ending with />) don't need to be tracked
  }

  if (tagStack.length > 0) {
    return { 
      valid: false, 
      error: `Unclosed tags: ${tagStack.join(', ')}` 
    };
  }

  return { valid: true };
}

/**
 * Formats XML string with proper indentation
 */
export function formatXml(xmlString: string, indentSize: number = 2): string {
  if (!xmlString || typeof xmlString !== 'string') {
    throw new Error('XML string is required');
  }

  const validation = validateXml(xmlString);
  if (!validation.valid) {
    throw new Error(`Invalid XML: ${validation.error}`);
  }

  try {
    // Remove existing formatting
    const cleanXml = xmlString.replace(/>\s*</g, '><').trim();
    
    let formatted = '';
    let indent = 0;
    const indentStr = ' '.repeat(indentSize);
    
    // Split by tags
    const tags = cleanXml.split(/(<[^>]*>)/);
    
    for (let i = 0; i < tags.length; i++) {
      const tag = tags[i];
      
      if (!tag) continue;
      
      if (tag.match(/^<\/\w/)) {
        // Closing tag
        indent--;
        formatted += indentStr.repeat(Math.max(0, indent)) + tag;
        if (i < tags.length - 1) formatted += '\n';
      } else if (tag.match(/^<\w[^>]*[^\/]>$/)) {
        // Opening tag
        formatted += indentStr.repeat(indent) + tag;
        if (i < tags.length - 1) formatted += '\n';
        indent++;
      } else if (tag.match(/^<\w[^>]*\/>$/)) {
        // Self-closing tag
        formatted += indentStr.repeat(indent) + tag;
        if (i < tags.length - 1) formatted += '\n';
      } else if (tag.match(/^<[?!]/)) {
        // Declaration or comment
        formatted += indentStr.repeat(indent) + tag;
        if (i < tags.length - 1) formatted += '\n';
      } else if (tag.trim()) {
        // Text content
        formatted += indentStr.repeat(indent) + tag.trim();
        if (i < tags.length - 1) formatted += '\n';
      }
    }
    
    return formatted;
  } catch (error) {
    throw new Error(`XML formatting failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Minifies XML by removing unnecessary whitespace
 */
export function minifyXml(xmlString: string): string {
  if (!xmlString || typeof xmlString !== 'string') {
    throw new Error('XML string is required');
  }

  const validation = validateXml(xmlString);
  if (!validation.valid) {
    throw new Error(`Invalid XML: ${validation.error}`);
  }

  return xmlString
    .replace(/>\s+</g, '><')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extracts XML structure information
 */
export function analyzeXml(xmlString: string): {
  elements: number;
  attributes: number;
  textNodes: number;
  comments: number;
  depth: number;
} {
  if (!xmlString || typeof xmlString !== 'string') {
    throw new Error('XML string is required');
  }

  const validation = validateXml(xmlString);
  if (!validation.valid) {
    throw new Error(`Invalid XML: ${validation.error}`);
  }

  try {
    // Check if we're in a browser environment
    if (typeof DOMParser !== 'undefined') {
      // Browser environment - use DOMParser for detailed analysis
      const parser = new DOMParser();
      const doc = parser.parseFromString(xmlString, 'text/xml');
      
      let elements = 0;
      let attributes = 0;
      let textNodes = 0;
      let comments = 0;
      let maxDepth = 0;

      function traverse(node: Node, depth: number = 0): void {
        maxDepth = Math.max(maxDepth, depth);
        
        if (node.nodeType === Node.ELEMENT_NODE) {
          elements++;
          const element = node as Element;
          attributes += element.attributes.length;
        } else if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
          textNodes++;
        } else if (node.nodeType === Node.COMMENT_NODE) {
          comments++;
        }
        
        for (let i = 0; i < node.childNodes.length; i++) {
          traverse(node.childNodes[i], depth + 1);
        }
      }
      
      traverse(doc, 0);
      
      return {
        elements,
        attributes,
        textNodes,
        comments,
        depth: maxDepth
      };
    } else {
      // Node.js environment - use regex-based analysis
      return basicXmlAnalysis(xmlString);
    }
  } catch (error) {
    throw new Error(`XML analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Basic XML analysis for Node.js environment using regex
 */
function basicXmlAnalysis(xmlString: string): {
  elements: number;
  attributes: number;
  textNodes: number;
  comments: number;
  depth: number;
} {
  let elements = 0;
  let attributes = 0;
  let textNodes = 0;
  let comments = 0;
  let maxDepth = 0;
  let currentDepth = 0;

  // Count self-closing tags
  const selfClosingRegex = /<\w[^>]*\/>/g;
  const selfClosingMatches = xmlString.match(selfClosingRegex) || [];
  
  // Count opening tags (not self-closing)
  const openingTagRegex = /<\w[^>]*(?<!\/)\s*>/g;
  const openingMatches = xmlString.match(openingTagRegex) || [];
  
  elements = openingMatches.length + selfClosingMatches.length;

  // Count attributes (rough estimate)
  const attributeRegex = /\s+\w+\s*=\s*["'][^"']*["']/g;
  const attributeMatches = xmlString.match(attributeRegex) || [];
  attributes = attributeMatches.length;

  // Count comments
  const commentRegex = /<!--[\s\S]*?-->/g;
  const commentMatches = xmlString.match(commentRegex) || [];
  comments = commentMatches.length;

  // Calculate depth by tracking opening/closing tags
  const allTags = xmlString.match(/<[^>]+>/g) || [];
  for (const tag of allTags) {
    if (tag.startsWith('</')) {
      // Closing tag
      currentDepth--;
    } else if (!tag.endsWith('/>') && !tag.startsWith('<?') && !tag.startsWith('<!--')) {
      // Opening tag (not self-closing, not declaration, not comment)
      currentDepth++;
      maxDepth = Math.max(maxDepth, currentDepth);
    }
  }

  // Count text nodes (rough estimate)
  const textContent = xmlString
    .replace(/<[^>]+>/g, '') // Remove all tags
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
  
  if (textContent.length > 0) {
    // Count non-empty text segments
    const textSegments = textContent.split(' ').filter(segment => segment.length > 0);
    textNodes = Math.max(1, Math.floor(textSegments.length / 3)); // Rough estimate
  }

  return {
    elements,
    attributes,
    textNodes,
    comments,
    depth: maxDepth
  };
}
