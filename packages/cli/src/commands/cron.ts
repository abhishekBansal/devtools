import { Command } from 'commander';
import {
  validateCronExpression,
  explainCronExpression,
  expandCronExpression,
  CRON_PRESETS,
} from '@devtools/core';

export function createCronCommand(): Command {
  const cronCommand = new Command('cron');
  cronCommand.description('Cron expression utilities');

  // Validate command
  cronCommand
    .command('validate')
    .description('Validate a cron expression')
    .argument('<expression>', 'Cron expression to validate')
    .action((expression: string) => {
      const result = validateCronExpression(expression);
      
      if (result.valid) {
        console.log('✅ Valid cron expression');
        console.log(`Expression: ${expression}`);
        console.log(`Explanation: ${explainCronExpression(expression)}`);
      } else {
        console.error('❌ Invalid cron expression');
        console.error(`Error: ${result.error}`);
        process.exit(1);
      }
    });

  // Explain command
  cronCommand
    .command('explain')
    .description('Explain what a cron expression does')
    .argument('<expression>', 'Cron expression to explain')
    .action((expression: string) => {
      const validation = validateCronExpression(expression);
      
      if (!validation.valid) {
        console.error('❌ Invalid cron expression');
        console.error(`Error: ${validation.error}`);
        process.exit(1);
      }

      console.log(`Expression: ${expression}`);
      console.log(`Explanation: ${explainCronExpression(expression)}`);
      
      // Show expanded form if it's a common expression
      const expanded = expandCronExpression(expression);
      if (expanded !== expression) {
        console.log(`Expanded: ${expanded}`);
      }
    });

  // Expand command
  cronCommand
    .command('expand')
    .description('Expand common cron expressions (@hourly, @daily, etc.)')
    .argument('<expression>', 'Common cron expression to expand')
    .action((expression: string) => {
      const expanded = expandCronExpression(expression);
      
      if (expanded === expression) {
        console.log(`Expression is already in standard format: ${expression}`);
      } else {
        console.log(`Original: ${expression}`);
        console.log(`Expanded: ${expanded}`);
        console.log(`Explanation: ${explainCronExpression(expanded)}`);
      }
    });

  // Presets command
  cronCommand
    .command('presets')
    .description('Show common cron expression presets')
    .option('-f, --format <format>', 'Output format: table, json, list', 'table')
    .action((options) => {
      if (options.format === 'json') {
        console.log(JSON.stringify(CRON_PRESETS, null, 2));
        return;
      }

      if (options.format === 'list') {
        CRON_PRESETS.forEach(preset => {
          console.log(`${preset.name}: ${preset.expression}`);
        });
        return;
      }

      // Default table format
      console.log('Common Cron Expression Presets:\n');
      console.log('Name'.padEnd(30) + 'Expression'.padEnd(20) + 'Explanation');
      console.log('-'.repeat(80));
      
      CRON_PRESETS.forEach(preset => {
        const explanation = explainCronExpression(preset.expression);
        console.log(
          preset.name.padEnd(30) + 
          preset.expression.padEnd(20) + 
          explanation
        );
      });
    });

  return cronCommand;
}
