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
    return yoTest.run(generator)
      .withPrompts({
        confirm: false,
        confirmAlias: false
      })
      .on('ready', _gen => {
        gen = _gen
        gen.log = spy()
      })
      .then(() => {
        assert.notOk(gen.log.calledWith('Loopback alias and hosts configurations removed!'))
      })
  })
  it('deletes platform directory', () => {
    let gen
    const dir = path.join(TEMP, 'testRemove')
    createDir(dir)
    return yoTest.run(generator)
      .withOptions({ sudoOverride: true })
      .withPrompts({
        confirm: true,
        confirmAlias: false
      })
      .on('ready', _gen => {
        gen = _gen
        _gen.config.set('promptValues', {
          path: dir
        })
        gen.log = spy()
      })
      .then(() => {
        assert.notOk(directoryExists(dir))
      })
  })
})
