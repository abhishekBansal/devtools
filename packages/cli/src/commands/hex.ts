import { Command } from 'commander';
import {
  hexToAscii,
  asciiToHex,
  hexToBinary,
  binaryToHex,
  hexToDecimal,
  decimalToHex,
} from '@devtools/core';

export function createHexCommand(): Command {
  const hex = new Command('hex')
    .description('Hexadecimal conversion utilities');

  hex
    .command('to-ascii')
    .description('Convert hex to ASCII')
    .argument('<hex>', 'Hexadecimal string to convert')
    .action((hexString: string) => {
      try {
        const result = hexToAscii(hexString);
        console.log(result);
      } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
        process.exit(1);
      }
    });

  hex
    .command('from-ascii')
    .description('Convert ASCII to hex')
    .argument('<ascii>', 'ASCII string to convert')
    .action((ascii: string) => {
      try {
        const result = asciiToHex(ascii);
        console.log(result);
      } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
        process.exit(1);
      }
    });

  hex
    .command('to-binary')
    .description('Convert hex to binary')
    .argument('<hex>', 'Hexadecimal string to convert')
    .action((hexString: string) => {
      try {
        const result = hexToBinary(hexString);
        console.log(result);
      } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
        process.exit(1);
      }
    });

  hex
    .command('from-binary')
    .description('Convert binary to hex')
    .argument('<binary>', 'Binary string to convert')
    .action((binary: string) => {
      try {
        const result = binaryToHex(binary);
        console.log(result);
      } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
        process.exit(1);
      }
    });

  hex
    .command('to-decimal')
    .description('Convert hex to decimal')
    .argument('<hex>', 'Hexadecimal string to convert')
    .action((hexString: string) => {
      try {
        const result = hexToDecimal(hexString);
        console.log(result);
      } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
        process.exit(1);
      }
    });

  hex
    .command('from-decimal')
    .description('Convert decimal to hex')
    .argument('<decimal>', 'Decimal number to convert')
    .action((decimal: string) => {
      try {
        const num = parseInt(decimal, 10);
        if (isNaN(num)) {
          throw new Error('Invalid decimal number');
        }
        const result = decimalToHex(num);
        console.log(result);
      } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
        process.exit(1);
      }
    });

  return hex;
}
