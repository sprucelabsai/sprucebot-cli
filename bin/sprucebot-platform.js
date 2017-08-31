#!/usr/bin/env node

const program = require('commander')

const platformInit = require('../actions/platform/init')

program
  .command('init')
  .action(platformInit)

program
  .option('--dev', 'manage developer environment')
  .parse(process.argv)

if (program.dev) {
  // TODO inquire about github forks needed
  console.log('Using developer mode')
}
