import { Command } from 'commander';
import { validateJson, formatJson, minifyJson } from '@devtools/core';

export function createJsonCommand(): Command {
  const json = new Command('json')
    .description('JSON validation and formatting utilities');

  json
    .command('validate')
    .description('Validate JSON string')
    .argument('<json>', 'JSON string to validate')
    .action((jsonString: string) => {
      try {
        const result = validateJson(jsonString);
        if (result.isValid) {
          console.log('✓ Valid JSON');
          process.exit(0);
        } else {
          console.error('✗ Invalid JSON:', result.error);
          process.exit(1);
        }
      } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
        process.exit(1);
      }
    });

  json
    .command('format')
    .description('Format JSON with proper indentation')
    .argument('<json>', 'JSON string to format')
    .option('-i, --indent <number>', 'Number of spaces for indentation', '2')
    .action((jsonString: string, options: { indent: string }) => {
      try {
        const indent = parseInt(options.indent, 10);
        const result = formatJson(jsonString, indent);
        console.log(result);
      } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
        process.exit(1);
      }
    });

  json
    .command('minify')
    .description('Minify JSON by removing whitespace')
    .argument('<json>', 'JSON string to minify')
    .action((jsonString: string) => {
      try {
        const result = minifyJson(jsonString);
        console.log(result);
      } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
        process.exit(1);
      }
    });

  return json;
}
