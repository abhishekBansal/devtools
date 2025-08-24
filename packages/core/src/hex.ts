/**
 * Hexadecimal conversion utilities
 */

/**
 * Converts hexadecimal string to ASCII
 * @param hex - Hexadecimal string to convert
 * @returns ASCII string
 */
export function hexToAscii(hex: string): string {
  if (typeof hex !== 'string') {
    throw new Error('Input must be a string');
  }

  // Remove any spaces and convert to lowercase
  const cleanHex = hex.replace(/\s+/g, '').toLowerCase();

  // Validate hex string
  if (!/^[0-9a-f]*$/i.test(cleanHex)) {
    throw new Error('Invalid hexadecimal string');
  }

  if (cleanHex.length % 2 !== 0) {
    throw new Error('Hexadecimal string must have even length');
  }

  let result = '';
  for (let i = 0; i < cleanHex.length; i += 2) {
    const hexPair = cleanHex.substr(i, 2);
    const charCode = parseInt(hexPair, 16);
    result += String.fromCharCode(charCode);
  }

  return result;
}

/**
 * Converts ASCII string to hexadecimal
 * @param ascii - ASCII string to convert
 * @returns Hexadecimal string
 */
export function asciiToHex(ascii: string): string {
  if (typeof ascii !== 'string') {
    throw new Error('Input must be a string');
  }

  let result = '';
  for (let i = 0; i < ascii.length; i++) {
    const hex = ascii.charCodeAt(i).toString(16);
    result += hex.padStart(2, '0');
  }

  return result.toUpperCase();
}

/**
 * Converts hexadecimal to binary
 * @param hex - Hexadecimal string to convert
 * @returns Binary string
 */
export function hexToBinary(hex: string): string {
  if (typeof hex !== 'string') {
    throw new Error('Input must be a string');
  }

  const cleanHex = hex.replace(/\s+/g, '').toLowerCase();

  if (!/^[0-9a-f]*$/i.test(cleanHex)) {
    throw new Error('Invalid hexadecimal string');
  }

  let result = '';
  for (let i = 0; i < cleanHex.length; i++) {
    const digit = parseInt(cleanHex[i], 16);
    result += digit.toString(2).padStart(4, '0');
  }

  return result;
}

/**
 * Converts binary to hexadecimal
 * @param binary - Binary string to convert
 * @returns Hexadecimal string
 */
export function binaryToHex(binary: string): string {
  if (typeof binary !== 'string') {
    throw new Error('Input must be a string');
  }

  const cleanBinary = binary.replace(/\s+/g, '');

  if (!/^[01]*$/.test(cleanBinary)) {
    throw new Error('Invalid binary string');
  }

  // Pad to multiple of 4 bits
  const paddedBinary = cleanBinary.padStart(
    Math.ceil(cleanBinary.length / 4) * 4,
    '0'
  );

  let result = '';
  for (let i = 0; i < paddedBinary.length; i += 4) {
    const nibble = paddedBinary.substr(i, 4);
    const hex = parseInt(nibble, 2).toString(16);
    result += hex;
  }

  return result.toUpperCase();
}

/**
 * Converts hexadecimal to decimal
 * @param hex - Hexadecimal string to convert
 * @returns Decimal number
 */
export function hexToDecimal(hex: string): number {
  if (typeof hex !== 'string') {
    throw new Error('Input must be a string');
  }

  const cleanHex = hex.replace(/\s+/g, '').toLowerCase();

  if (cleanHex === '') {
    return 0;
  }

  if (!/^[0-9a-f]*$/i.test(cleanHex)) {
    throw new Error('Invalid hexadecimal string');
  }

  return parseInt(cleanHex, 16);
}

/**
 * Converts decimal to hexadecimal
 * @param decimal - Decimal number to convert
 * @returns Hexadecimal string
 */
export function decimalToHex(decimal: number): string {
  if (typeof decimal !== 'number' || !Number.isInteger(decimal)) {
    throw new Error('Input must be an integer');
  }

  if (decimal < 0) {
    throw new Error('Input must be a non-negative integer');
  }

  return decimal.toString(16).toUpperCase();
}
