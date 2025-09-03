/**
 * Text diffing utilities for comparing two texts and showing differences
 */

export interface DiffLine {
  type: 'added' | 'removed' | 'unchanged' | 'modified';
  lineNumber: number;
  content: string;
  originalLineNumber?: number;
  newLineNumber?: number;
}

export interface DiffResult {
  lines: DiffLine[];
  stats: {
    added: number;
    removed: number;
    modified: number;
    unchanged: number;
    totalLines: number;
  };
  similarity: number; // percentage of similarity between texts
}

export type DiffMode = 'line' | 'word' | 'character';

/**
 * Calculates the similarity percentage between two strings using Levenshtein distance
 */
function calculateSimilarity(text1: string, text2: string): number {
  if (text1 === text2) return 100;
  if (text1.length === 0 || text2.length === 0) return 0;

  const matrix: number[][] = [];
  
  // Initialize the matrix
  for (let i = 0; i <= text1.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= text2.length; j++) {
    matrix[0][j] = j;
  }
  
  // Fill the matrix
  for (let i = 1; i <= text1.length; i++) {
    for (let j = 1; j <= text2.length; j++) {
      if (text1.charAt(i - 1) === text2.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  
  const distance = matrix[text1.length][text2.length];
  const maxLength = Math.max(text1.length, text2.length);
  return Math.round(((maxLength - distance) / maxLength) * 100);
}

/**
 * Finds the longest common subsequence between two arrays
 */
function longestCommonSubsequence<T>(arr1: T[], arr2: T[]): number[][] {
  const m = arr1.length;
  const n = arr2.length;
  const lcs: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (arr1[i - 1] === arr2[j - 1]) {
        lcs[i][j] = lcs[i - 1][j - 1] + 1;
      } else {
        lcs[i][j] = Math.max(lcs[i - 1][j], lcs[i][j - 1]);
      }
    }
  }
  
  return lcs;
}

/**
 * Performs line-based diff comparison
 */
export function diffLines(text1: string, text2: string): DiffResult {
  if (typeof text1 !== 'string' || typeof text2 !== 'string') {
    throw new Error('Both inputs must be strings');
  }

  const lines1 = text1 === '' ? [] : text1.split('\n');
  const lines2 = text2 === '' ? [] : text2.split('\n');
  
  const lcs = longestCommonSubsequence(lines1, lines2);
  const diffLines: DiffLine[] = [];
  
  let i = lines1.length;
  let j = lines2.length;
  let lineNumber = 1;
  
  // Backtrack through LCS to build diff
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && lines1[i - 1] === lines2[j - 1]) {
      // Lines are the same
      diffLines.unshift({
        type: 'unchanged',
        lineNumber: lineNumber++,
        content: lines1[i - 1],
        originalLineNumber: i,
        newLineNumber: j
      });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || lcs[i][j - 1] >= lcs[i - 1][j])) {
      // Line was added
      diffLines.unshift({
        type: 'added',
        lineNumber: lineNumber++,
        content: lines2[j - 1],
        newLineNumber: j
      });
      j--;
    } else if (i > 0 && (j === 0 || lcs[i][j - 1] < lcs[i - 1][j])) {
      // Line was removed
      diffLines.unshift({
        type: 'removed',
        lineNumber: lineNumber++,
        content: lines1[i - 1],
        originalLineNumber: i
      });
      i--;
    }
  }
  
  // Calculate statistics
  const stats = {
    added: diffLines.filter(line => line.type === 'added').length,
    removed: diffLines.filter(line => line.type === 'removed').length,
    modified: diffLines.filter(line => line.type === 'modified').length,
    unchanged: diffLines.filter(line => line.type === 'unchanged').length,
    totalLines: diffLines.length
  };
  
  const similarity = calculateSimilarity(text1, text2);
  
  return {
    lines: diffLines,
    stats,
    similarity
  };
}

/**
 * Performs word-based diff comparison
 */
export function diffWords(text1: string, text2: string): DiffResult {
  if (typeof text1 !== 'string' || typeof text2 !== 'string') {
    throw new Error('Both inputs must be strings');
  }

  const words1 = text1.split(/(\s+)/);
  const words2 = text2.split(/(\s+)/);
  
  const lcs = longestCommonSubsequence(words1, words2);
  const diffLines: DiffLine[] = [];
  
  let i = words1.length;
  let j = words2.length;
  let lineNumber = 1;
  
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && words1[i - 1] === words2[j - 1]) {
      diffLines.unshift({
        type: 'unchanged',
        lineNumber: lineNumber++,
        content: words1[i - 1],
        originalLineNumber: i,
        newLineNumber: j
      });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || lcs[i][j - 1] >= lcs[i - 1][j])) {
      diffLines.unshift({
        type: 'added',
        lineNumber: lineNumber++,
        content: words2[j - 1],
        newLineNumber: j
      });
      j--;
    } else if (i > 0 && (j === 0 || lcs[i][j - 1] < lcs[i - 1][j])) {
      diffLines.unshift({
        type: 'removed',
        lineNumber: lineNumber++,
        content: words1[i - 1],
        originalLineNumber: i
      });
      i--;
    }
  }
  
  const stats = {
    added: diffLines.filter(line => line.type === 'added').length,
    removed: diffLines.filter(line => line.type === 'removed').length,
    modified: diffLines.filter(line => line.type === 'modified').length,
    unchanged: diffLines.filter(line => line.type === 'unchanged').length,
    totalLines: diffLines.length
  };
  
  const similarity = calculateSimilarity(text1, text2);
  
  return {
    lines: diffLines,
    stats,
    similarity
  };
}

/**
 * Performs character-based diff comparison
 */
export function diffCharacters(text1: string, text2: string): DiffResult {
  if (typeof text1 !== 'string' || typeof text2 !== 'string') {
    throw new Error('Both inputs must be strings');
  }

  const chars1 = text1.split('');
  const chars2 = text2.split('');
  
  const lcs = longestCommonSubsequence(chars1, chars2);
  const diffLines: DiffLine[] = [];
  
  let i = chars1.length;
  let j = chars2.length;
  let lineNumber = 1;
  
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && chars1[i - 1] === chars2[j - 1]) {
      diffLines.unshift({
        type: 'unchanged',
        lineNumber: lineNumber++,
        content: chars1[i - 1],
        originalLineNumber: i,
        newLineNumber: j
      });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || lcs[i][j - 1] >= lcs[i - 1][j])) {
      diffLines.unshift({
        type: 'added',
        lineNumber: lineNumber++,
        content: chars2[j - 1],
        newLineNumber: j
      });
      j--;
    } else if (i > 0 && (j === 0 || lcs[i][j - 1] < lcs[i - 1][j])) {
      diffLines.unshift({
        type: 'removed',
        lineNumber: lineNumber++,
        content: chars1[i - 1],
        originalLineNumber: i
      });
      i--;
    }
  }
  
  const stats = {
    added: diffLines.filter(line => line.type === 'added').length,
    removed: diffLines.filter(line => line.type === 'removed').length,
    modified: diffLines.filter(line => line.type === 'modified').length,
    unchanged: diffLines.filter(line => line.type === 'unchanged').length,
    totalLines: diffLines.length
  };
  
  const similarity = calculateSimilarity(text1, text2);
  
  return {
    lines: diffLines,
    stats,
    similarity
  };
}

/**
 * Main diff function that supports different comparison modes
 */
export function diffText(text1: string, text2: string, mode: DiffMode = 'line'): DiffResult {
  switch (mode) {
    case 'line':
      return diffLines(text1, text2);
    case 'word':
      return diffWords(text1, text2);
    case 'character':
      return diffCharacters(text1, text2);
    default:
      throw new Error(`Unsupported diff mode: ${mode}`);
  }
}

/**
 * Creates a unified diff string representation (similar to git diff output)
 */
export function createUnifiedDiff(text1: string, text2: string, filename1 = 'original', filename2 = 'modified'): string {
  const diffResult = diffLines(text1, text2);
  const lines: string[] = [];
  
  lines.push(`--- ${filename1}`);
  lines.push(`+++ ${filename2}`);
  
  let originalLineNumber = 1;
  let newLineNumber = 1;
  
  for (const diffLine of diffResult.lines) {
    switch (diffLine.type) {
      case 'removed':
        lines.push(`-${diffLine.content}`);
        originalLineNumber++;
        break;
      case 'added':
        lines.push(`+${diffLine.content}`);
        newLineNumber++;
        break;
      case 'unchanged':
        lines.push(` ${diffLine.content}`);
        originalLineNumber++;
        newLineNumber++;
        break;
    }
  }
  
  return lines.join('\n');
}

/**
 * Creates side-by-side diff for better visualization
 */
export function createSideBySideDiff(text1: string, text2: string): { original: string[]; modified: string[]; }[] {
  const diffResult = diffLines(text1, text2);
  const result: { original: string[]; modified: string[]; }[] = [];
  
  for (const diffLine of diffResult.lines) {
    switch (diffLine.type) {
      case 'removed':
        result.push({
          original: [diffLine.content],
          modified: ['']
        });
        break;
      case 'added':
        result.push({
          original: [''],
          modified: [diffLine.content]
        });
        break;
      case 'unchanged':
        result.push({
          original: [diffLine.content],
          modified: [diffLine.content]
        });
        break;
    }
  }
  
  return result;
}
