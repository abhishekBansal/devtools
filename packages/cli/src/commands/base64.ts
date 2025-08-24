import { Command } from 'commander';
import { encodeBase64, decodeBase64 } from '@devtools/core';

export function createBase64Command(): Command {
  const base64 = new Command('base64')
    .description('Base64 encoding and decoding utilities');

  base64
    .command('encode')
    .description('Encode text to Base64')
    .argument('<text>', 'Text to encode')
    .action((text: string) => {
      try {
        const result = encodeBase64(text);
        console.log(result);
      } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
        process.exit(1);
      }
    });

  base64
    .command('decode')
    .description('Decode Base64 to text')
    .argument('<encoded>', 'Base64 encoded text to decode')
    .action((encoded: string) => {
      try {
        const result = decodeBase64(encoded);
        console.log(result);
      } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
        process.exit(1);
      }
    });

  return base64;
}
