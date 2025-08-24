/**
 * Cron expression utilities for parsing, validating, and explaining cron expressions
 */

interface CronField {
  min: number;
  max: number;
  name: string;
  values?: { [key: string]: number };
}

const CRON_FIELDS: CronField[] = [
  { min: 0, max: 59, name: 'minute' },
  { min: 0, max: 23, name: 'hour' },
  { min: 1, max: 31, name: 'day' },
  { min: 1, max: 12, name: 'month', values: {
    'JAN': 1, 'FEB': 2, 'MAR': 3, 'APR': 4, 'MAY': 5, 'JUN': 6,
    'JUL': 7, 'AUG': 8, 'SEP': 9, 'OCT': 10, 'NOV': 11, 'DEC': 12
  }},
  { min: 0, max: 6, name: 'day_of_week', values: {
    'SUN': 0, 'MON': 1, 'TUE': 2, 'WED': 3, 'THU': 4, 'FRI': 5, 'SAT': 6
  }}
];

const COMMON_EXPRESSIONS = {
  '@yearly': '0 0 1 1 *',
  '@annually': '0 0 1 1 *',
  '@monthly': '0 0 1 * *',
  '@weekly': '0 0 * * 0',
  '@daily': '0 0 * * *',
  '@midnight': '0 0 * * *',
  '@hourly': '0 * * * *'
};

/**
 * Validates a cron expression
 */
export function validateCronExpression(expression: string): { valid: boolean; error?: string } {
  if (!expression || typeof expression !== 'string') {
    return { valid: false, error: 'Cron expression is required' };
  }

  const trimmed = expression.trim();
  
  // Check for common expressions
  if (trimmed in COMMON_EXPRESSIONS) {
    return { valid: true };
  }

  const parts = trimmed.split(/\s+/);
  
  if (parts.length !== 5) {
    return { valid: false, error: 'Cron expression must have exactly 5 fields (minute hour day month day_of_week)' };
  }

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const field = CRON_FIELDS[i];
    
    const validation = validateCronField(part, field);
    if (!validation.valid) {
      return { valid: false, error: `Invalid ${field.name}: ${validation.error}` };
    }
  }

  return { valid: true };
}

/**
 * Validates a single cron field
 */
function validateCronField(value: string, field: CronField): { valid: boolean; error?: string } {
  if (value === '*') {
    return { valid: true };
  }

  // Handle ranges (e.g., 1-5)
  if (value.includes('-')) {
    const [start, end] = value.split('-');
    const startNum = parseFieldValue(start, field);
    const endNum = parseFieldValue(end, field);
    
    if (startNum === null || endNum === null) {
      return { valid: false, error: 'Invalid range values' };
    }
    
    if (startNum < field.min || startNum > field.max || endNum < field.min || endNum > field.max) {
      return { valid: false, error: `Range values must be between ${field.min} and ${field.max}` };
    }
    
    if (startNum > endNum) {
      return { valid: false, error: 'Range start must be less than or equal to range end' };
    }
    
    return { valid: true };
  }

  // Handle steps (e.g., */5, 1-10/2)
  if (value.includes('/')) {
    const [range, step] = value.split('/');
    const stepNum = parseInt(step, 10);
    
    if (isNaN(stepNum) || stepNum <= 0) {
      return { valid: false, error: 'Step value must be a positive integer' };
    }
    
    if (range !== '*') {
      return validateCronField(range, field);
    }
    
    return { valid: true };
  }

  // Handle lists (e.g., 1,3,5)
  if (value.includes(',')) {
    const values = value.split(',');
    for (const val of values) {
      const validation = validateCronField(val.trim(), field);
      if (!validation.valid) {
        return validation;
      }
    }
    return { valid: true };
  }

  // Handle single values
  const num = parseFieldValue(value, field);
  if (num === null) {
    return { valid: false, error: 'Invalid value' };
  }
  
  if (num < field.min || num > field.max) {
    return { valid: false, error: `Value must be between ${field.min} and ${field.max}` };
  }

  return { valid: true };
}

/**
 * Parses a field value, handling named values
 */
function parseFieldValue(value: string, field: CronField): number | null {
  // Try parsing as number first
  const num = parseInt(value, 10);
  if (!isNaN(num)) {
    return num;
  }

  // Try parsing as named value
  if (field.values && value.toUpperCase() in field.values) {
    return field.values[value.toUpperCase()];
  }

  return null;
}

/**
 * Explains a cron expression in human-readable format
 */
export function explainCronExpression(expression: string): string {
  if (!expression) {
    return 'Invalid cron expression';
  }

  const trimmed = expression.trim();
  
  // Handle common expressions
  if (trimmed in COMMON_EXPRESSIONS) {
    const explanations = {
      '@yearly': 'Once a year at midnight on January 1st',
      '@annually': 'Once a year at midnight on January 1st',
      '@monthly': 'Once a month at midnight on the 1st day',
      '@weekly': 'Once a week at midnight on Sunday',
      '@daily': 'Once a day at midnight',
      '@midnight': 'Once a day at midnight',
      '@hourly': 'Once an hour at the beginning of the hour'
    };
    return explanations[trimmed as keyof typeof explanations];
  }

  const validation = validateCronExpression(trimmed);
  if (!validation.valid) {
    return `Invalid cron expression: ${validation.error}`;
  }

  const parts = trimmed.split(/\s+/);
  const [minute, hour, day, month, dayOfWeek] = parts;

  const explanations: string[] = [];

  // Build time explanation
  const timeExplanation = explainTime(minute, hour);
  explanations.push(timeExplanation);

  // Build date explanation
  const dateExplanation = explainDate(day, month, dayOfWeek);
  if (dateExplanation) {
    explanations.push(dateExplanation);
  }

  return explanations.join(' ');
}

/**
 * Explains the time part (minute and hour)
 */
function explainTime(minute: string, hour: string): string {
  const minuteDesc = explainField(minute, 'minute');
  const hourDesc = explainField(hour, 'hour');

  if (minute === '0' && hour === '*') {
    return 'At the beginning of every hour';
  }

  if (minute === '0' && hour !== '*') {
    return `At ${hourDesc}`;
  }

  if (hour === '*') {
    return `At ${minuteDesc} of every hour`;
  }

  return `At ${minuteDesc} past ${hourDesc}`;
}

/**
 * Explains the date part (day, month, day of week)
 */
function explainDate(day: string, month: string, dayOfWeek: string): string {
  const parts: string[] = [];

  if (dayOfWeek !== '*') {
    parts.push(`on ${explainField(dayOfWeek, 'day_of_week')}`);
  }

  if (day !== '*') {
    if (dayOfWeek !== '*') {
      parts.push(`and on ${explainField(day, 'day')} of the month`);
    } else {
      parts.push(`on ${explainField(day, 'day')} of the month`);
    }
  }

  if (month !== '*') {
    parts.push(`in ${explainField(month, 'month')}`);
  }

  return parts.join(' ');
}

/**
 * Explains a single cron field
 */
function explainField(value: string, fieldType: string): string {
  if (value === '*') {
    return `every ${fieldType}`;
  }

  const field = CRON_FIELDS.find(f => f.name === fieldType);
  if (!field) {
    return value;
  }

  // Handle ranges
  if (value.includes('-')) {
    const [start, end] = value.split('-');
    return `${formatFieldValue(start, field)} through ${formatFieldValue(end, field)}`;
  }

  // Handle steps
  if (value.includes('/')) {
    const [range, step] = value.split('/');
    if (range === '*') {
      return `every ${step} ${fieldType}s`;
    }
    return `every ${step} ${fieldType}s in range ${explainField(range, fieldType)}`;
  }

  // Handle lists
  if (value.includes(',')) {
    const values = value.split(',').map(v => formatFieldValue(v.trim(), field));
    if (values.length === 2) {
      return `${values[0]} and ${values[1]}`;
    }
    return `${values.slice(0, -1).join(', ')}, and ${values[values.length - 1]}`;
  }

  // Single value
  return formatFieldValue(value, field);
}

/**
 * Formats a field value for display
 */
function formatFieldValue(value: string, field: CronField): string {
  const num = parseFieldValue(value, field);
  
  if (field.name === 'hour') {
    if (num === 0) return 'midnight';
    if (num === 12) return 'noon';
    if (num! < 12) return `${num}:00 AM`;
    return `${num! - 12}:00 PM`;
  }

  if (field.name === 'day_of_week') {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[num!] || value;
  }

  if (field.name === 'month') {
    const months = ['', 'January', 'February', 'March', 'April', 'May', 'June',
                   'July', 'August', 'September', 'October', 'November', 'December'];
    return months[num!] || value;
  }

  if (field.name === 'day') {
    const ordinals = ['', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th',
                     '11th', '12th', '13th', '14th', '15th', '16th', '17th', '18th', '19th', '20th',
                     '21st', '22nd', '23rd', '24th', '25th', '26th', '27th', '28th', '29th', '30th', '31st'];
    return ordinals[num!] || value;
  }

  if (field.name === 'minute') {
    if (num === 0) return '0 minutes';
    if (num === 1) return '1 minute';
    return `${num} minutes`;
  }

  return value;
}

/**
 * Converts common expressions to standard cron format
 */
export function expandCronExpression(expression: string): string {
  const trimmed = expression.trim();
  return COMMON_EXPRESSIONS[trimmed as keyof typeof COMMON_EXPRESSIONS] || trimmed;
}

/**
 * Gets the next few execution times for a cron expression
 */
export function getNextExecutions(expression: string, count: number = 5): string[] {
  const validation = validateCronExpression(expression);
  if (!validation.valid) {
    throw new Error(`Invalid cron expression: ${validation.error}`);
  }

  // This is a simplified implementation
  // In a real application, you'd use a proper cron parser library
  const executions: string[] = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const nextTime = new Date(now.getTime() + (i + 1) * 60 * 60 * 1000); // Simplified: next hour
    executions.push(nextTime.toISOString());
  }
  
  return executions;
}

/**
 * Common cron expression presets
 */
export const CRON_PRESETS = [
  { name: 'Every minute', expression: '* * * * *' },
  { name: 'Every 5 minutes', expression: '*/5 * * * *' },
  { name: 'Every 15 minutes', expression: '*/15 * * * *' },
  { name: 'Every 30 minutes', expression: '*/30 * * * *' },
  { name: 'Every hour', expression: '@hourly' },
  { name: 'Every day at midnight', expression: '@daily' },
  { name: 'Every day at 6 AM', expression: '0 6 * * *' },
  { name: 'Every day at 6 PM', expression: '0 18 * * *' },
  { name: 'Every weekday at 9 AM', expression: '0 9 * * 1-5' },
  { name: 'Every weekend at 10 AM', expression: '0 10 * * 6,0' },
  { name: 'Every week (Sunday midnight)', expression: '@weekly' },
  { name: 'Every month (1st at midnight)', expression: '@monthly' },
  { name: 'Every year (Jan 1st at midnight)', expression: '@yearly' }
];
