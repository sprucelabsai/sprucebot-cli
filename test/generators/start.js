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

  it('prompts if path not previously set', () => {
    let gen
    return yoTest.run(generator)
      .withPrompts({ path: dir })
      .on('ready', _gen => {
        gen = _gen
        _gen.config.set({
          promptValues: {
            path: null
          }
        })
        gen.spawnCommandSync = stub().returns({ error: null })
      })
      .then(() => {
        assert.equal(gen.promptValues.path, dir)
      })
  })

  it('throws if no valid docker-compose.yml', () => {
    const dir = path.join(TEMP, 'sprucebot')
    rmdir(dir)
    createDir(dir)
    let gen
    return yoTest.run(generator)
      .withPrompts({ path: dir })
      .on('ready', _gen => {
        gen = _gen
        _gen.config.set({
          promptValues: {
            path: dir
          }
        })
        gen.spawnCommandSync = stub().returns({ error: null })
      })
      .then(() => {
        assert.notOk(true, 'Generator should have thrown an error')
      })
      .catch(e => {
        assert.include(e.message, `Uh oh, I can't find a valid docker-compose.yml in ${dir}`)
      })
  })

  it('spawns docker-compose command', () => {
    const dir = path.join(TEMP, 'sprucebot')
    createDir(dir)
    fs.writeFileSync(path.join(dir, 'docker-compose.yml'), 'version: 3')
    let gen
    return yoTest.run(generator)
      .withOptions({ path: dir })
      .on('ready', _gen => {
        gen = _gen
        gen.spawnCommandSync = stub().returns({ error: null })
      })
      .then(() => {
        assert.ok(gen.spawnCommandSync.calledWith('docker-compose', ['up'], {
          cwd: dir
        }))
      })
  })
})
