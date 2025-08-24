/**
 * UUID generation utilities
 */

/**
 * Generates a random UUID v4
 * @returns UUID v4 string
 */
export function generateUuidV4(): string {
  // Check if we're in a browser environment with crypto.randomUUID
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Check if we're in a browser environment with crypto.getRandomValues
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    
    // Set version (4) and variant bits
    array[6] = (array[6] & 0x0f) | 0x40;
    array[8] = (array[8] & 0x3f) | 0x80;
    
    const hex = Array.from(array)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    return [
      hex.slice(0, 8),
      hex.slice(8, 12),
      hex.slice(12, 16),
      hex.slice(16, 20),
      hex.slice(20, 32)
    ].join('-');
  }

  // Fallback implementation for Node.js environments
  const randomBytes = () => {
    const bytes = [];
    for (let i = 0; i < 16; i++) {
      bytes.push(Math.floor(Math.random() * 256));
    }
    return bytes;
  };

  const bytes = randomBytes();
  
  // Set version (4) and variant bits
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  
  const hex = bytes
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32)
  ].join('-');
}

/**
 * Validates if a string is a valid UUID
 * @param uuid - String to validate
 * @returns Boolean indicating if the string is a valid UUID
 */
export function isValidUuid(uuid: string): boolean {
  if (typeof uuid !== 'string') {
    return false;
  }

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Generates multiple UUIDs
 * @param count - Number of UUIDs to generate
 * @returns Array of UUID strings
 */
export function generateMultipleUuids(count: number): string[] {
  if (typeof count !== 'number' || count < 1 || !Number.isInteger(count)) {
    throw new Error('Count must be a positive integer');
  }

  if (count > 1000) {
    throw new Error('Count cannot exceed 1000');
  }

  const uuids: string[] = [];
  for (let i = 0; i < count; i++) {
    uuids.push(generateUuidV4());
  }
  return uuids;
}
