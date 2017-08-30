#!/usr/bin/env node

const program = require('commander')
const yeoman = require('yeoman-environment')

const Platform = require('../generators/Platform')

const env = yeoman.createEnv()

program
  .command('init')
  .action((...args) => {
    console.log('initializing packages', args)
    env.registerStub(Platform, 'sprucebot')

    env.run('sprucebot', () => console.log('Done!'))
  })

program
  .option('--dev', 'manage developer environment')
  .parse(process.argv)

if (program.dev) {
  // TODO inquire about github forks needed
  console.log('Using developer mode')
}
