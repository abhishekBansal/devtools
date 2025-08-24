import { Command } from 'commander';
import { 
  analyzeString, 
  convertCase,
  toCamelCase,
  toPascalCase,
  toSnakeCase,
  toKebabCase,
  toConstantCase,
  toTitleCase,
  toSentenceCase,
  type StringAnalysis 
} from '@devtools/core';

export function stringCommand(): Command {
  const cmd = new Command('string');
  cmd.description('String analysis and manipulation tools');

  // String analyzer subcommand
  cmd
    .command('analyze')
    .description('Analyze string metrics and properties')
    .argument('<text>', 'Text to analyze')
    .action((text) => {
      try {
        const analysis = analyzeString(text);
        console.log('String Analysis:');
        console.log('================');
        console.log(`Length: ${analysis.length}`);
        console.log(`Characters: ${analysis.characters}`);
        console.log(`Characters (no spaces): ${analysis.charactersNoSpaces}`);
        console.log(`Words: ${analysis.words}`);
        console.log(`Lines: ${analysis.lines}`);
        console.log(`Paragraphs: ${analysis.paragraphs}`);
        console.log(`Sentences: ${analysis.sentences}`);
        console.log(`Bytes (UTF-8): ${analysis.bytes}`);
        console.log(`Uppercase letters: ${analysis.uppercase}`);
        console.log(`Lowercase letters: ${analysis.lowercase}`);
        console.log(`Digits: ${analysis.digits}`);
        console.log(`Letters: ${analysis.letters}`);
        console.log(`Special characters: ${analysis.specialChars}`);
        console.log(`Whitespace characters: ${analysis.whitespace}`);
      } catch (error) {
        console.error('Error analyzing string:', error instanceof Error ? error.message : error);
        process.exit(1);
      }
    });

  // Case conversion subcommands
  cmd
    .command('camel')
    .description('Convert string to camelCase')
    .argument('<text>', 'Text to convert')
    .action((text) => {
      try {
        const result = toCamelCase(text);
        console.log(result);
      } catch (error) {
        console.error('Error converting to camelCase:', error instanceof Error ? error.message : error);
        process.exit(1);
      }
    });

  cmd
    .command('pascal')
    .description('Convert string to PascalCase')
    .argument('<text>', 'Text to convert')
    .action((text) => {
      try {
        const result = toPascalCase(text);
        console.log(result);
      } catch (error) {
        console.error('Error converting to PascalCase:', error instanceof Error ? error.message : error);
        process.exit(1);
      }
    });

  cmd
    .command('snake')
    .description('Convert string to snake_case')
    .argument('<text>', 'Text to convert')
    .action((text) => {
      try {
        const result = toSnakeCase(text);
        console.log(result);
      } catch (error) {
        console.error('Error converting to snake_case:', error instanceof Error ? error.message : error);
        process.exit(1);
      }
    });

  cmd
    .command('kebab')
    .description('Convert string to kebab-case')
    .argument('<text>', 'Text to convert')
    .action((text) => {
      try {
        const result = toKebabCase(text);
        console.log(result);
      } catch (error) {
        console.error('Error converting to kebab-case:', error instanceof Error ? error.message : error);
        process.exit(1);
      }
    });

  cmd
    .command('constant')
    .description('Convert string to CONSTANT_CASE')
    .argument('<text>', 'Text to convert')
    .action((text) => {
      try {
        const result = toConstantCase(text);
        console.log(result);
      } catch (error) {
        console.error('Error converting to CONSTANT_CASE:', error instanceof Error ? error.message : error);
        process.exit(1);
      }
    });

  cmd
    .command('title')
    .description('Convert string to Title Case')
    .argument('<text>', 'Text to convert')
    .action((text) => {
      try {
        const result = toTitleCase(text);
        console.log(result);
      } catch (error) {
        console.error('Error converting to Title Case:', error instanceof Error ? error.message : error);
        process.exit(1);
      }
    });

  cmd
    .command('sentence')
    .description('Convert string to Sentence case')
    .argument('<text>', 'Text to convert')
    .action((text) => {
      try {
        const result = toSentenceCase(text);
        console.log(result);
      } catch (error) {
        console.error('Error converting to Sentence case:', error instanceof Error ? error.message : error);
        process.exit(1);
      }
    });

  return cmd;
}
