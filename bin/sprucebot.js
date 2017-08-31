#!/usr/bin/env node

/**
 * The `sprucebot` command line tool is used to initiate and run SpruceBot applications
 * @example
 * # sprucebot -v
 * # sprucebot -h
 * # sprucebot npmStart [args...]
 */
const program = require('commander')
const {
  version,
  description
} = require('config')

/**
 * General tool options and usage help
 */
program
  .version(version)
  .description(description)
  // Commands are registered without .action callback. This tells `commander`
  // that we use seperate executables in ./bin/ for sub-commands
  // registering `platform` will execute `./bin/sprucebot-platform.js`
  .command('platform [options]', 'Manage platform local init, start/stop, and deployment')

program.parse(process.argv)
