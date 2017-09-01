#!/usr/bin/env node
const {
  Command
} = require('commander')

const platformInit = require('./init')

function setup (argv) {
  const program = new Command()

  program
    .command('init')
    .action(platformInit)

  program
    .option('--dev', 'manage developer environment')

  program.parse(argv)

  if (program.dev) {
    // TODO inquire about github forks needed
    console.log('Using developer mode')
  }

  return program
}

module.exports = setup
