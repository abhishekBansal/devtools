#!/usr/bin/env node

import { Command } from 'commander';
import { createBase64Command } from './commands/base64.js';
import { createJsonCommand } from './commands/json.js';
import { createHexCommand } from './commands/hex.js';
import { createTimestampCommand } from './commands/timestamp.js';
import { createUuidCommand } from './commands/uuid.js';
import { createCronCommand } from './commands/cron.js';
import { stringCommand } from './commands/string.js';
import { xmlCommand } from './commands/xml.js';
import { colorCommand } from './commands/color.js';
import { diffCommand } from './commands/diff.js';

const program = new Command();

program
  .name('devtools')
  .description('Developer utilities CLI')
  .version('1.1.0');

// Add all commands
program.addCommand(createBase64Command());
program.addCommand(createJsonCommand());
program.addCommand(createHexCommand());
program.addCommand(createTimestampCommand());
program.addCommand(createUuidCommand());
program.addCommand(createCronCommand());
program.addCommand(stringCommand());
program.addCommand(xmlCommand());
program.addCommand(colorCommand());
program.addCommand(diffCommand());

// Parse command line arguments
program.parse(process.argv);
