/**
 * Base64 encoding and decoding utilities
 */

/**
 * Encodes a string to Base64
 * @param input - The string to encode
 * @returns Base64 encoded string
 */
export function encodeBase64(input: string): string {
  if (typeof input !== 'string') {
    throw new Error('Input must be a string');
  }

  // Handle both browser and Node.js environments
  if (typeof btoa !== 'undefined') {
    // Browser environment
    return btoa(unescape(encodeURIComponent(input)));
  } else {
    // Node.js environment
    return Buffer.from(input, 'utf8').toString('base64');
  }
}

/**
 * Decodes a Base64 string
 * @param input - The Base64 string to decode
 * @returns Decoded string
 */
export function decodeBase64(input: string): string {
  if (typeof input !== 'string') {
    throw new Error('Input must be a string');
  }

  try {
    // Handle both browser and Node.js environments
    if (typeof atob !== 'undefined') {
      // Browser environment
      return decodeURIComponent(escape(atob(input)));
    } else {
      // Node.js environment
      return Buffer.from(input, 'base64').toString('utf8');
    }
  } catch (error) {
    throw new Error('Invalid Base64 string');
  }
}
