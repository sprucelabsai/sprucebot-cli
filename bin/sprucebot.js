#!/usr/bin/env node

/**
 * The `sprucebot` command line tool is used to initiate and run SpruceBot applications
 * @example
 * # sprucebot -v
 * # sprucebot -h
 * # sprucebot npmStart [args...]
 */
const {
  Command
} = require('commander')
const path = require('path')
// Override the NODE_CONFIG DIR if not set
// This allows us to use the cli from any directory
process.env.NODE_CONFIG_DIR = process.env.NODE_CONFIG_DIR || path.join(__dirname, '../config')
const {
  version,
  description
} = require('config')

function setup (argv) {
  const program = new Command()

  /**
   * General tool options and usage help
   */
  program
    .version(version)
    .description(description)
    // Commands are registered without .action callback. This tells `commander`
    // that we use separate executables in ./bin/ for sub-commands
    // registering `platform` will execute `./bin/sprucebot-platform.js`
    .command('platform [options]', 'Setup and deploy the Sprucebot platform')
    .command('skill [options]', 'Create and edit Sprucebot skills')

  program.parse(process.argv)
}

module.exports = setup(process.argv)
