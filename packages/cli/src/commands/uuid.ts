import { Command } from 'commander';
import { generateUuidV4, isValidUuid, generateMultipleUuids } from '@devtools/core';

export function createUuidCommand(): Command {
  const uuid = new Command('uuid')
    .description('UUID generation and validation utilities');

  uuid
    .command('generate')
    .description('Generate UUID v4')
    .option('-c, --count <number>', 'Number of UUIDs to generate', '1')
    .action((options: { count: string }) => {
      try {
        const count = parseInt(options.count, 10);
        if (isNaN(count) || count < 1) {
          throw new Error('Count must be a positive number');
        }

        if (count === 1) {
          console.log(generateUuidV4());
        } else {
          const uuids = generateMultipleUuids(count);
          uuids.forEach(uuid => console.log(uuid));
        }
      } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
        process.exit(1);
      }
    });

  uuid
    .command('validate')
    .description('Validate UUID format')
    .argument('<uuid>', 'UUID to validate')
    .action((uuidString: string) => {
      try {
        const isValid = isValidUuid(uuidString);
        if (isValid) {
          console.log('✓ Valid UUID');
          process.exit(0);
        } else {
          console.log('✗ Invalid UUID');
          process.exit(1);
        }
      } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
        process.exit(1);
      }
    });

  return uuid;
}
