/**
 * Timestamp conversion utilities
 */

/**
 * Converts Unix timestamp to ISO string
 * @param timestamp - Unix timestamp (seconds since epoch)
 * @returns ISO 8601 formatted string
 */
export function unixToIso(timestamp: number): string {
  if (typeof timestamp !== 'number') {
    throw new Error('Timestamp must be a number');
  }

  if (timestamp < 0) {
    throw new Error('Timestamp must be non-negative');
  }

  // Handle both seconds and milliseconds timestamps
  const timestampMs = timestamp.toString().length <= 10 
    ? timestamp * 1000 
    : timestamp;

  const date = new Date(timestampMs);
  
  if (isNaN(date.getTime())) {
    throw new Error('Invalid timestamp');
  }

  return date.toISOString();
}

/**
 * Converts ISO string to Unix timestamp
 * @param isoString - ISO 8601 formatted string
 * @returns Unix timestamp (seconds since epoch)
 */
export function isoToUnix(isoString: string): number {
  if (typeof isoString !== 'string') {
    throw new Error('Input must be a string');
  }

  const date = new Date(isoString);
  
  if (isNaN(date.getTime())) {
    throw new Error('Invalid ISO string');
  }

  return Math.floor(date.getTime() / 1000);
}

/**
 * Gets current timestamp in Unix format
 * @returns Current Unix timestamp (seconds since epoch)
 */
export function getCurrentUnixTimestamp(): number {
  return Math.floor(Date.now() / 1000);
}

/**
 * Gets current timestamp in ISO format
 * @returns Current ISO 8601 formatted string
 */
export function getCurrentIsoTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Converts timestamp to human-readable format
 * @param timestamp - Unix timestamp or ISO string
 * @param options - Formatting options
 * @returns Human-readable date string
 */
export function formatTimestamp(
  timestamp: number | string,
  options: Intl.DateTimeFormatOptions = {}
): string {
  let date: Date;

  if (typeof timestamp === 'number') {
    const timestampMs = timestamp.toString().length <= 10 
      ? timestamp * 1000 
      : timestamp;
    date = new Date(timestampMs);
  } else {
    date = new Date(timestamp);
  }

  if (isNaN(date.getTime())) {
    throw new Error('Invalid timestamp');
  }

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
    ...options,
  };

  return date.toLocaleDateString('en-US', defaultOptions);
}
