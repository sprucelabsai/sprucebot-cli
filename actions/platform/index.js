#!/usr/bin/env node
const {
  Command
} = require('commander')

const platformInit = require('./init')
const platformConfigure = require('./configure')
const platformStart = require('./start')

function setup (argv) {
  const program = new Command()

  program
  .command('configure')
  .action(platformConfigure)

  program
  .command('init [path]')
  .option('--skip-install', 'Skip git repository installations')
  .action(platformInit)

  program
  .command('start [path]')
  .action(platformStart)

  program.parse(argv)

  return program
}

module.exports = argv => setup(argv)
