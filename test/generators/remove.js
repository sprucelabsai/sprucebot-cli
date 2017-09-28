/* eslint-env mocha */
const path = require('path')
const fs = require('fs')
const {assert} = require('chai')
const {spy, stub} = require('sinon')
const chalk = require('chalk')

const {
  directoryExists
} = require('../../utils/dir')

const yoTest = require('yeoman-test')

const generator = require('../../generators/remove')

describe('Remove Generator', () => {
  it('respects confirmation prompts', () => {
    let gen
    let dir
    return yoTest.run(generator)
      .inTmpDir(_dir => {
        dir = _dir
      })
      .withPrompts({
        confirm: false,
        confirmHosts: false,
        confirmDocker: false
      })
      .on('ready', _gen => {
        gen = _gen
        gen.log = spy()
      })
      .then(() => {
        assert.notOk(gen.log.calledWith('Hosts configuration removed!'))
        assert.notOk(gen.log.calledWith('Bam! Removed docker images!'))
        assert.notOk(gen.log.calledWith(`${dir} removed!`))
      })
  })
  it('deletes platform directory', () => {
    let dir
    return yoTest.run(generator)
      .inTmpDir(_dir => {
        dir = _dir
      })
      .withOptions({sudoOverride: true})
      .withPrompts({
        confirm: true,
        confirmHosts: false,
        confirmDocker: false
      })
      .then(() => {
        assert.notOk(directoryExists(dir))
      })
  })
  it('removes docker images', () => {
    let gen

    return yoTest.run(generator)
      .inTmpDir(dir => {
        fs.writeFileSync(path.join(dir, 'docker-compose.yml'), `
    services:
      testService:
        container_name: test_service
    `)
      })
      .withPrompts({
        confirm: false,
        confirmHosts: false,
        confirmDocker: true
      })
      .on('ready', _gen => {
        gen = _gen
        gen.log = spy()
        gen.spawnCommandSync = stub().returns()
      })
      .then(() => {
        assert.ok(gen.spawnCommandSync.calledWith('docker', ['rmi', 'test_service']))
        assert.ok(gen.log.calledWith(chalk.green('Bam! Removed docker images!')))
      })
  })
})
