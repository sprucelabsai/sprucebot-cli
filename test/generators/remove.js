/* eslint-env mocha */
const path = require('path')
const fs = require('fs')
const { assert } = require('chai')
const { spy, stub } = require('sinon')
const chalk = require('chalk')

const {
  createDir,
  directoryExists
} = require('../../utils/dir')

const yoTest = require('yeoman-test')

const generator = require('../../generators/remove')

const TEMP = path.join(__dirname, '../../__TEST__')

describe('Remove Generator', () => {
  it('respects confirmation prompts', () => {
    let gen
    const dir = path.join(TEMP, 'test')
    createDir(dir)
    return yoTest.run(generator)
      .withLocalConfig({promptValues: {
        path: dir
      }})
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
    const dir = path.join(TEMP, 'testRemove')
    createDir(dir)
    assert.ok(directoryExists(dir))
    return yoTest.run(generator)
      .withLocalConfig({promptValues: {
        path: dir
      }})
      .withOptions({ sudoOverride: true })
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
    const dir = path.join(TEMP, 'test')
    fs.writeFileSync(path.join(dir, 'docker-compose.yml'), `
    services:
      testService:
        container_name: test_service
    `)
    return yoTest.run(generator)
      .withLocalConfig({
        promptValues: {
          path: dir
        }
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
