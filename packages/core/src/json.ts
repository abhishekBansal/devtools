/**
 * JSON validation and formatting utilities
 */

export interface JsonValidationResult {
  isValid: boolean;
  error?: string;
  data?: any;
}

/**
 * Validates a JSON string
 * @param input - The JSON string to validate
 * @returns Validation result with success/error information
 */
export function validateJson(input: string): JsonValidationResult {
  if (typeof input !== 'string') {
    return {
      isValid: false,
      error: 'Input must be a string',
    };
  }

  if (input.trim() === '') {
    return {
      isValid: false,
      error: 'Input cannot be empty',
    };
  }

  try {
    const data = JSON.parse(input);
    return {
      isValid: true,
      data,
    };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Invalid JSON',
    };
  }
}

/**
 * Formats a JSON string with proper indentation
 * @param input - The JSON string to format
 * @param indent - Number of spaces for indentation (default: 2)
 * @returns Formatted JSON string
 */
export function formatJson(input: string, indent: number = 2): string {
  const validation = validateJson(input);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  return JSON.stringify(validation.data, null, indent);
}

/**
 * Minifies a JSON string by removing all whitespace
 * @param input - The JSON string to minify
 * @returns Minified JSON string
 */
export function minifyJson(input: string): string {
  const validation = validateJson(input);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  return JSON.stringify(validation.data);
}
