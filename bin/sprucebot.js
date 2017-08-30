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

const {
  npmStart,
  dockerStart
 } = require('../tasks')

/**
 * General tool options and usage help
 */
program
  .version(version)
  .description(description)

/**
 * Register the `npmStart` command
 * @namespace npmStart
 */
program
  .command('npmStart [args...]')
  .description('Start any npm project')
  .action(npmStart)

/**
 * Register the `dockerStart` command
 * @namespace dockerStart
 */
program
  .command('dockerStart [args...]')
  .description('Start any docker project')
  .action(dockerStart)

program.parse(process.argv)
