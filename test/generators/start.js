/* eslint-env mocha */
const path = require('path')
const fs = require('fs')
const { assert } = require('chai')
const { stub } = require('sinon')

const yoTest = require('yeoman-test')

const generator = require('../../generators/start')

const {
  createDir,
  rmdir
} = require('../../utils/dir')

const TEMP = path.join(__dirname, '../../__TEMP__')

describe('Start generator', () => {
  const dir = path.join(TEMP, 'sprucebot')

  beforeEach(() => {
    createDir(dir)
    fs.writeFileSync(path.join(dir, 'docker-compose.yml'), 'version: 3')
  })

  afterEach(() => {
    rmdir(dir)
  })

  it('throws if no valid docker-compose.yml', () => {
    let gen
    return yoTest.run(generator)
      .inTmpDir()
      .on('ready', _gen => {
        gen = _gen
        gen.spawnCommandSync = stub().returns({ error: null })
      })
      .then(() => {
        assert.notOk(true, 'Generator should have thrown an error')
      })
      .catch(e => {
        assert.match(e.message, /I can't find a valid docker-compose.yml/)
      })
  })

  it('spawns docker-compose command', () => {
    let gen
    return yoTest.run(generator)
      .inTmpDir(dir => {
        fs.writeFileSync(path.join(dir, 'docker-compose.yml'), 'version: 3')
      })
      .on('ready', _gen => {
        gen = _gen
        gen.spawnCommandSync = stub().returns({ error: null })
      })
      .then(() => {
        assert.ok(gen.spawnCommandSync.calledWith('docker-compose', ['up']))
      })
  })
})
