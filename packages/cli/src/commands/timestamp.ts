import { Command } from 'commander';
import {
  unixToIso,
  isoToUnix,
  getCurrentUnixTimestamp,
  getCurrentIsoTimestamp,
  formatTimestamp,
} from '@devtools/core';

export function createTimestampCommand(): Command {
  const timestamp = new Command('timestamp')
    .description('Timestamp conversion utilities');

  timestamp
    .command('to-iso')
    .description('Convert Unix timestamp to ISO string')
    .argument('<timestamp>', 'Unix timestamp to convert')
    .action((ts: string) => {
      try {
        const num = parseInt(ts, 10);
        if (isNaN(num)) {
          throw new Error('Invalid timestamp');
        }
        const result = unixToIso(num);
        console.log(result);
      } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
        process.exit(1);
      }
    });

  timestamp
    .command('to-unix')
    .description('Convert ISO string to Unix timestamp')
    .argument('<iso>', 'ISO string to convert')
    .action((iso: string) => {
      try {
        const result = isoToUnix(iso);
        console.log(result);
      } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
        process.exit(1);
      }
    });

  timestamp
    .command('now')
    .description('Get current timestamp')
    .option('-u, --unix', 'Output as Unix timestamp')
    .option('-i, --iso', 'Output as ISO string')
    .option('-f, --format', 'Output as human-readable format')
    .action((options: { unix?: boolean; iso?: boolean; format?: boolean }) => {
      try {
        if (options.unix) {
          console.log(getCurrentUnixTimestamp());
        } else if (options.iso) {
          console.log(getCurrentIsoTimestamp());
        } else if (options.format) {
          console.log(formatTimestamp(getCurrentUnixTimestamp()));
        } else {
          // Default: show all formats
          const unix = getCurrentUnixTimestamp();
          const iso = getCurrentIsoTimestamp();
          const formatted = formatTimestamp(unix);
          console.log(`Unix: ${unix}`);
          console.log(`ISO: ${iso}`);
          console.log(`Formatted: ${formatted}`);
        }
      } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
        process.exit(1);
      }
    });

  timestamp
    .command('format')
    .description('Format timestamp as human-readable string')
    .argument('<timestamp>', 'Unix timestamp or ISO string to format')
    .action((ts: string) => {
      try {
        // Try to parse as number first, then as ISO string
        const num = parseInt(ts, 10);
        const input = isNaN(num) ? ts : num;
        const result = formatTimestamp(input);
        console.log(result);
      } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
        process.exit(1);
      }
    });

  return timestamp;
}
