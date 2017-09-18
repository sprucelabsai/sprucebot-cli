#!/usr/bin/env node
const {
  Command
} = require('commander')

const platformInit = require('./init')
const platformConfigure = require('./configure')
const platformStart = require('./start')
const platformRemove = require('./remove')
const platformVersion = require('./version')

function setup (argv) {
  const program = new Command()

  program
  .command('configure')
  .action(platformConfigure)

  program
  .command('init [path]')
  .option('--skip-install', 'Skip cloning repositories')
  .option('-s --select-version', 'Wanna select a version? Cool, add --select-version flag')
  .option('-r --reset-prompt', 'Reset previously saved prompts')
  .action(platformInit)

  program
  .command('version')
  .option('-r --reset-prompt', 'Reset previously saved prompts')
  .action(platformVersion)

  program
  .command('start [path]')
  .option('-r --reset-prompt', 'Reset previously saved prompts')
  .action(platformStart)

  program
  .command('remove [path]')
  .option('-r --reset-prompt', 'Reset previously saved prompts')
  .action(platformRemove)

  program.parse(argv)

  return program
}

module.exports = argv => setup(argv)
