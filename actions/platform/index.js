#!/usr/bin/env node
const {
  Command
} = require('commander')

const platformInit = require('./init')
const platformConfigure = require('./configure')
const platformStart = require('./start')
const platformBuild = require('./rebuild')
const platformRemove = require('./remove')
const platformVersion = require('./version')
const platformOwnerCreate = require('./ownerCreate')

function setup (argv) {
  const program = new Command()

  program
    .command('configure')
    .action(platformConfigure)

  program
    .command('init [path]')
    .option('--skip-install', 'Skip cloning repositories')
    .option('-s --select-version', 'Wanna select a version? Cool, add --select-version flag')
    .action(platformInit)

  program
    .command('version')
    .action(platformVersion)

  program
    .command('start [path]')
    .action(platformStart)

  program
    .command('rebuild [path]')
    .action(platformBuild)

  program
    .command('remove [path]')
    .action(platformRemove)

  program
    .command('owner:create [cellphone]')
    .action(platformOwnerCreate)

  program.parse(argv)

  return program
}

module.exports = argv => setup(argv)
