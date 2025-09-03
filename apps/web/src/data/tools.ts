export interface ToolDef {
  slug: string;
  title: string;
  category: 'Encoding' | 'JSON & Data' | 'Text' | 'Time' | 'Code' | 'Misc';
  description: string;
  keywords: string[];
  related: string[];
}

export const tools: ToolDef[] = [
  {
    slug: 'base64-encoder-decoder',
    title: 'Base64 Encoder/Decoder',
    category: 'Encoding',
    description: 'Encode and decode Base64 strings with UTF-8 support',
    keywords: ['base64', 'encode', 'decode', 'utf8', 'encoding'],
    related: ['hex-text-converter', 'url-encoder-decoder'],
  },
  {
    slug: 'json-validator-formatter',
    title: 'JSON Validator & Formatter',
    category: 'JSON & Data',
    description: 'Validate, format, and minify JSON with error highlighting',
    keywords: ['json', 'validate', 'format', 'minify', 'parser'],
    related: ['base64-encoder-decoder', 'url-encoder-decoder'],
  },
  {
    slug: 'hex-text-converter',
    title: 'Hex Text Converter',
    category: 'Encoding',
    description: 'Convert between hex, ASCII, binary, and decimal formats',
    keywords: ['hex', 'hexadecimal', 'ascii', 'binary', 'decimal', 'converter'],
    related: ['base64-encoder-decoder', 'unicode-converter'],
  },
  {
    slug: 'timestamp-converter',
    title: 'Timestamp Converter',
    category: 'Time',
    description: 'Convert between Unix timestamps and human-readable dates',
    keywords: ['timestamp', 'unix', 'iso', 'date', 'time', 'epoch'],
    related: ['cron-expression-parser', 'json-validator-formatter'],
  },
  {
    slug: 'uuid-generator',
    title: 'UUID Generator',
    category: 'Code',
    description: 'Generate and validate UUID v4 with bulk generation support',
    keywords: ['uuid', 'guid', 'generator', 'unique', 'identifier'],
    related: ['timestamp-converter', 'hash-generator'],
  },
  {
    slug: 'cron-expression-parser',
    title: 'Cron Expression Parser',
    category: 'Time',
    description: 'Parse, validate, and explain cron expressions with human-readable descriptions',
    keywords: ['cron', 'schedule', 'parser', 'validator', 'expression', 'time'],
    related: ['timestamp-converter', 'uuid-generator'],
  },
  {
    slug: 'string-analyzer',
    title: 'String Analyzer',
    category: 'Text',
    description: 'Analyze text strings to get detailed statistics including character count, word count, and more',
    keywords: ['string', 'text', 'analyze', 'count', 'words', 'characters', 'statistics'],
    related: ['string-case-converter', 'text-formatter'],
  },
  {
    slug: 'string-case-converter',
    title: 'String Case Converter',
    category: 'Text',
    description: 'Convert text between different case formats including camelCase, snake_case, kebab-case, and more',
    keywords: ['string', 'case', 'convert', 'camel', 'snake', 'kebab', 'pascal', 'constant'],
    related: ['string-analyzer', 'text-formatter'],
  },
  {
    slug: 'xml-formatter',
    title: 'XML Formatter',
    category: 'JSON & Data',
    description: 'Format, validate, and minify XML documents with proper indentation and error checking',
    keywords: ['xml', 'format', 'validate', 'minify', 'parser', 'pretty'],
    related: ['json-validator-formatter', 'html-formatter'],
  },
  {
    slug: 'color-converter',
    title: 'Color Converter',
    category: 'Code',
    description: 'Convert colors between different formats (Hex, RGB, HSL, HSV, CMYK) and analyze accessibility',
    keywords: ['color', 'convert', 'hex', 'rgb', 'hsl', 'hsv', 'cmyk', 'accessibility', 'wcag'],
    related: ['css-formatter', 'image-color-extractor'],
  },
  {
    slug: 'text-diff',
    title: 'Text Diff Tool',
    category: 'Text',
    description: 'Compare two texts and visualize differences with line-by-line, word-by-word, or character-by-character comparison',
    keywords: ['diff', 'compare', 'text', 'merge', 'changes', 'git', 'version', 'side-by-side'],
    related: ['string-analyzer', 'string-case-converter', 'text-formatter'],
  },
];

export const categories = [
  'Encoding',
  'JSON & Data',
  'Text',
  'Time',
  'Code',
  'Misc',
] as const;

export function getToolBySlug(slug: string): ToolDef | undefined {
  return tools.find(tool => tool.slug === slug);
}

export function getToolsByCategory(category: string): ToolDef[] {
  return tools.filter(tool => tool.category === category);
}

export function searchTools(query: string): ToolDef[] {
  const lowercaseQuery = query.toLowerCase();
  return tools.filter(tool =>
    tool.title.toLowerCase().includes(lowercaseQuery) ||
    tool.description.toLowerCase().includes(lowercaseQuery) ||
    tool.keywords.some(keyword => keyword.toLowerCase().includes(lowercaseQuery)) ||
    tool.category.toLowerCase().includes(lowercaseQuery)
  );
}
