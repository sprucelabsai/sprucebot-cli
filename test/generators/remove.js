/* eslint-env mocha */
const path = require('path')
const { assert } = require('chai')
const { spy } = require('sinon')
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
        confirmAlias: false
      })
      .on('ready', _gen => {
        gen = _gen
        gen.log = spy()
      })
      .then(() => {
        assert.notOk(gen.log.calledWith('Hosts configuration removed!'))
        assert.notOk(gen.log.calledWith('Loopback Alias configuration removed!'))
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
        confirmAlias: false
      })
      .then(() => {
        assert.notOk(directoryExists(dir))
      })
  })
})
