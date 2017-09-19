#!/usr/bin/env node
const {
  Command
} = require('commander')

const skillCreate = require('./create')

function setup (argv) {
  const program = new Command()

  program
  .command('create <name>')
  .description('Create a new Sprucebot skill')
  .action(skillCreate)

  program.parse(argv)

  return program
}

module.exports = argv => setup(argv)
