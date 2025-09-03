import { Command } from 'commander';
import chalk from 'chalk';
import { 
  diffText, 
  createUnifiedDiff,
  createSideBySideDiff,
  type DiffMode
} from '@devtools/core';
import { readFileSync } from 'fs';

/**
 * Colorizes diff lines based on their type
 */
function colorDiffLine(line: string, type: 'added' | 'removed' | 'unchanged' | 'modified', noColor = false): string {
  if (noColor) return line;
  
  switch (type) {
    case 'added':
      return chalk.green(line);
    case 'removed':
      return chalk.red(line);
    case 'modified':
      return chalk.yellow(line);
    case 'unchanged':
      return chalk.gray(line);
    default:
      return line;
  }
}

/**
 * Colorizes unified diff output
 */
function colorUnifiedDiff(diffText: string, noColor = false): string {
  if (noColor) return diffText;
  
  return diffText
    .split('\n')
    .map(line => {
      if (line.startsWith('+++') || line.startsWith('---')) {
        return chalk.bold(line);
      } else if (line.startsWith('+')) {
        return chalk.green(line);
      } else if (line.startsWith('-')) {
        return chalk.red(line);
      } else if (line.startsWith(' ')) {
        return chalk.gray(line);
      }
      return line;
    })
    .join('\n');
}

export function diffCommand(): Command {
  const cmd = new Command('diff');
  cmd.description('Text diffing tools to compare two texts or files');

  // Text diff subcommand
  cmd
    .command('text')
    .description('Compare two text strings')
    .argument('<text1>', 'First text to compare')
    .argument('<text2>', 'Second text to compare')
    .option('-m, --mode <mode>', 'Diff mode: line, word, or character', 'line')
    .option('-u, --unified', 'Output in unified diff format')
    .option('-s, --side-by-side', 'Output in side-by-side format')
    .option('--stats', 'Show only statistics')
    .option('--no-color', 'Disable color output')
    .action((text1, text2, options) => {
      try {
        const mode = options.mode as DiffMode;
        
        if (!['line', 'word', 'character'].includes(mode)) {
          console.error(chalk.red('Error: Mode must be one of: line, word, character'));
          process.exit(1);
        }

        const diffResult = diffText(text1, text2, mode);

        if (options.stats) {
          console.log(chalk.bold('Diff Statistics:'));
          console.log(chalk.bold('================'));
          console.log(chalk.green(`Added: ${diffResult.stats.added}`));
          console.log(chalk.red(`Removed: ${diffResult.stats.removed}`));
          console.log(chalk.yellow(`Modified: ${diffResult.stats.modified}`));
          console.log(chalk.gray(`Unchanged: ${diffResult.stats.unchanged}`));
          console.log(`Total lines: ${diffResult.stats.totalLines}`);
          
          const similarity = diffResult.similarity;
          const coloredSimilarity = similarity > 70 ? chalk.green(`${similarity}%`) :
                                   similarity > 40 ? chalk.yellow(`${similarity}%`) :
                                   chalk.red(`${similarity}%`);
          console.log(`Similarity: ${coloredSimilarity}`);
          return;
        }

        if (options.unified) {
          const unifiedDiff = createUnifiedDiff(text1, text2, 'text1', 'text2');
          console.log(colorUnifiedDiff(unifiedDiff, options.noColor));
          return;
        }

        if (options.sideBySide) {
          const sideBySide = createSideBySideDiff(text1, text2);
          const leftHeader = options.noColor ? 'Original' : chalk.bold.blue('Original');
          const rightHeader = options.noColor ? 'Modified' : chalk.bold.blue('Modified');
          console.log(`${leftHeader}\t\t\t${rightHeader}`);
          console.log('========\t\t\t========');
          sideBySide.forEach(line => {
            const original = line.original[0] || '';
            const modified = line.modified[0] || '';
            
            let coloredOriginal = original;
            let coloredModified = modified;
            
            if (!options.noColor) {
              if (original && !modified) {
                coloredOriginal = chalk.red(original);
              } else if (!original && modified) {
                coloredModified = chalk.green(modified);
              } else if (original !== modified) {
                coloredOriginal = chalk.yellow(original);
                coloredModified = chalk.yellow(modified);
              } else {
                coloredOriginal = chalk.gray(original);
                coloredModified = chalk.gray(modified);
              }
            }
            
            console.log(`${coloredOriginal}\t\t\t${coloredModified}`);
          });
          return;
        }

        // Default output format
        const title = options.noColor ? `Diff Result (${mode} mode):` : chalk.bold.blue(`Diff Result (${mode} mode):`);
        console.log(title);
        console.log('========================');
        
        diffResult.lines.forEach(line => {
          const prefix = line.type === 'added' ? '+' : 
                        line.type === 'removed' ? '-' : 
                        line.type === 'modified' ? '~' : ' ';
          const fullLine = `${prefix} ${line.content}`;
          
          if (options.noColor) {
            console.log(fullLine);
          } else {
            console.log(colorDiffLine(fullLine, line.type));
          }
        });

        console.log(options.noColor ? '\nStatistics:' : chalk.bold('\nStatistics:'));
        const addedText = options.noColor ? `Added: ${diffResult.stats.added}` : chalk.green(`Added: ${diffResult.stats.added}`);
        const removedText = options.noColor ? `Removed: ${diffResult.stats.removed}` : chalk.red(`Removed: ${diffResult.stats.removed}`);
        const unchangedText = options.noColor ? `Unchanged: ${diffResult.stats.unchanged}` : chalk.gray(`Unchanged: ${diffResult.stats.unchanged}`);
        console.log(`${addedText}, ${removedText}, ${unchangedText}`);
        
        const similarity = diffResult.similarity;
        const similarityText = options.noColor ? `${similarity}%` :
                              similarity > 70 ? chalk.green(`${similarity}%`) :
                              similarity > 40 ? chalk.yellow(`${similarity}%`) :
                              chalk.red(`${similarity}%`);
        console.log(`Similarity: ${similarityText}`);

      } catch (error) {
        console.error(chalk.red('Error comparing texts:'), error instanceof Error ? error.message : error);
        process.exit(1);
      }
    });

  // File diff subcommand
  cmd
    .command('file')
    .description('Compare two files')
    .argument('<file1>', 'First file to compare')
    .argument('<file2>', 'Second file to compare')
    .option('-m, --mode <mode>', 'Diff mode: line, word, or character', 'line')
    .option('-u, --unified', 'Output in unified diff format')
    .option('-s, --side-by-side', 'Output in side-by-side format')
    .option('--stats', 'Show only statistics')
    .option('--no-color', 'Disable color output')
    .action((file1, file2, options) => {
      try {
        const text1 = readFileSync(file1, 'utf-8');
        const text2 = readFileSync(file2, 'utf-8');
        const mode = options.mode as DiffMode;
        
        if (!['line', 'word', 'character'].includes(mode)) {
          console.error(chalk.red('Error: Mode must be one of: line, word, character'));
          process.exit(1);
        }

        const diffResult = diffText(text1, text2, mode);

        if (options.stats) {
          const title = options.noColor ? `Diff Statistics for ${file1} vs ${file2}:` : 
                       chalk.bold(`Diff Statistics for ${chalk.cyan(file1)} vs ${chalk.cyan(file2)}:`);
          console.log(title);
          console.log('==========================================');
          console.log(chalk.green(`Added: ${diffResult.stats.added}`));
          console.log(chalk.red(`Removed: ${diffResult.stats.removed}`));
          console.log(chalk.yellow(`Modified: ${diffResult.stats.modified}`));
          console.log(chalk.gray(`Unchanged: ${diffResult.stats.unchanged}`));
          console.log(`Total lines: ${diffResult.stats.totalLines}`);
          
          const similarity = diffResult.similarity;
          const coloredSimilarity = similarity > 70 ? chalk.green(`${similarity}%`) :
                                   similarity > 40 ? chalk.yellow(`${similarity}%`) :
                                   chalk.red(`${similarity}%`);
          console.log(`Similarity: ${coloredSimilarity}`);
          return;
        }

        if (options.unified) {
          const unifiedDiff = createUnifiedDiff(text1, text2, file1, file2);
          console.log(colorUnifiedDiff(unifiedDiff, options.noColor));
          return;
        }

        if (options.sideBySide) {
          const sideBySide = createSideBySideDiff(text1, text2);
          const leftHeader = options.noColor ? file1 : chalk.bold.blue(file1);
          const rightHeader = options.noColor ? file2 : chalk.bold.blue(file2);
          console.log(`${leftHeader}\t\t\t${rightHeader}`);
          console.log('='.repeat(file1.length) + '\t\t\t' + '='.repeat(file2.length));
          sideBySide.forEach(line => {
            const original = line.original[0] || '';
            const modified = line.modified[0] || '';
            
            let coloredOriginal = original;
            let coloredModified = modified;
            
            if (!options.noColor) {
              if (original && !modified) {
                coloredOriginal = chalk.red(original);
              } else if (!original && modified) {
                coloredModified = chalk.green(modified);
              } else if (original !== modified) {
                coloredOriginal = chalk.yellow(original);
                coloredModified = chalk.yellow(modified);
              } else {
                coloredOriginal = chalk.gray(original);
                coloredModified = chalk.gray(modified);
              }
            }
            
            console.log(`${coloredOriginal}\t\t\t${coloredModified}`);
          });
          return;
        }

        // Default output format
        const title = options.noColor ? `Diff Result for ${file1} vs ${file2} (${mode} mode):` : 
                     chalk.bold.blue(`Diff Result for ${chalk.cyan(file1)} vs ${chalk.cyan(file2)} (${mode} mode):`);
        console.log(title);
        console.log('='.repeat(50));
        
        diffResult.lines.forEach(line => {
          const prefix = line.type === 'added' ? '+' : 
                        line.type === 'removed' ? '-' : 
                        line.type === 'modified' ? '~' : ' ';
          const fullLine = `${prefix} ${line.content}`;
          
          if (options.noColor) {
            console.log(fullLine);
          } else {
            console.log(colorDiffLine(fullLine, line.type));
          }
        });

        console.log(options.noColor ? '\nStatistics:' : chalk.bold('\nStatistics:'));
        const addedText = options.noColor ? `Added: ${diffResult.stats.added}` : chalk.green(`Added: ${diffResult.stats.added}`);
        const removedText = options.noColor ? `Removed: ${diffResult.stats.removed}` : chalk.red(`Removed: ${diffResult.stats.removed}`);
        const unchangedText = options.noColor ? `Unchanged: ${diffResult.stats.unchanged}` : chalk.gray(`Unchanged: ${diffResult.stats.unchanged}`);
        console.log(`${addedText}, ${removedText}, ${unchangedText}`);
        
        const similarity = diffResult.similarity;
        const similarityText = options.noColor ? `${similarity}%` :
                              similarity > 70 ? chalk.green(`${similarity}%`) :
                              similarity > 40 ? chalk.yellow(`${similarity}%`) :
                              chalk.red(`${similarity}%`);
        console.log(`Similarity: ${similarityText}`);

      } catch (error) {
        if (error instanceof Error && (error as any).code === 'ENOENT') {
          console.error(chalk.red('Error: File not found. Please check the file paths.'));
        } else {
          console.error(chalk.red('Error comparing files:'), error instanceof Error ? error.message : error);
        }
        process.exit(1);
      }
    });

  return cmd;
}
