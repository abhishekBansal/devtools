import { Command } from 'commander';
import { validateXml, formatXml, minifyXml, analyzeXml } from '@devtools/core';

export function xmlCommand(): Command {
  const cmd = new Command('xml');
  cmd.description('XML validation, formatting, and analysis tools');

  // XML validation subcommand
  cmd
    .command('validate')
    .description('Validate XML structure and syntax')
    .argument('<xml>', 'XML content to validate')
    .action((xml) => {
      try {
        const result = validateXml(xml);
        if (result.valid) {
          console.log('✓ Valid XML');
        } else {
          console.log('✗ Invalid XML');
          if (result.error) {
            console.error(`Error: ${result.error}`);
            if (result.line) {
              console.error(`Line: ${result.line}`);
            }
            if (result.column) {
              console.error(`Column: ${result.column}`);
            }
          }
          process.exit(1);
        }
      } catch (error) {
        console.error('Error validating XML:', error instanceof Error ? error.message : error);
        process.exit(1);
      }
    });

  // XML formatting subcommand
  cmd
    .command('format')
    .description('Format XML with proper indentation')
    .argument('<xml>', 'XML content to format')
    .option('-i, --indent <size>', 'Indent size (default: 2)', '2')
    .action((xml, options) => {
      try {
        const indentSize = parseInt(options.indent, 10);
        const formatted = formatXml(xml, indentSize);
        console.log(formatted);
      } catch (error) {
        console.error('Error formatting XML:', error instanceof Error ? error.message : error);
        process.exit(1);
      }
    });

  // XML minification subcommand
  cmd
    .command('minify')
    .description('Minify XML by removing whitespace')
    .argument('<xml>', 'XML content to minify')
    .action((xml) => {
      try {
        const minified = minifyXml(xml);
        console.log(minified);
      } catch (error) {
        console.error('Error minifying XML:', error instanceof Error ? error.message : error);
        process.exit(1);
      }
    });

  // XML analysis subcommand
  cmd
    .command('analyze')
    .description('Analyze XML structure and provide statistics')
    .argument('<xml>', 'XML content to analyze')
    .action((xml) => {
      try {
        const analysis = analyzeXml(xml);
        console.log('XML Analysis:');
        console.log('=============');
        console.log(`Elements: ${analysis.elements}`);
        console.log(`Attributes: ${analysis.attributes}`);
        console.log(`Text nodes: ${analysis.textNodes}`);
        console.log(`Comment nodes: ${analysis.comments}`);
        console.log(`Max depth: ${analysis.depth}`);
      } catch (error) {
        console.error('Error analyzing XML:', error instanceof Error ? error.message : error);
        process.exit(1);
      }
    });

  return cmd;
}
