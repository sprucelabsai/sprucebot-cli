#!/usr/bin/env node
const {
  Command
} = require('commander')

const platformInit = require('./init')

function setup (argv) {
  const program = new Command()

  program
  .command('init [path]')
  .action(platformInit)

  program
  .option('--dev', 'manage developer environment')

  program.parse(argv)

  return program
}

module.exports = argv => setup(argv)
