/* eslint-env mocha */
const path = require('path')
const {assert} = require('chai')
const {stub, spy} = require('sinon')
const hostile = require('hostile')

const yoTest = require('yeoman-test')

// const generator = path.join(__dirname, '../../generators/configure')
const generator = require('../../generators/configure')

const TEMP = path.join(__dirname, '../../__TEST__')

const promptValues = {
  path: TEMP,
  gitUser: 'test'
}

describe('Configure Generator', () => {
  beforeEach(() => {
    stub(hostile, 'set').returns()
    stub(hostile, 'getFile').returns([['127.0.0.1', 'local.test.com']])
    stub(hostile, 'get').returns([['127.0.0.1', 'test.local']])
    stub(hostile, 'remove').returns()
  })
  afterEach(() => {
    hostile.set.restore()
    hostile.getFile.restore()
    hostile.get.restore()
    hostile.remove.restore()
  })
  it('requires sudo', () => {
    return yoTest.run(generator)
      .withLocalConfig({ promptValues })
      .withOptions({sudoOverride: false})
      .then(() => {
        assert.notOk(true, 'Generator should have thrown exception')
      })
      .catch((e) => {
        assert.isAtLeast(e.message.search(/need root access/), 0, 'Sudo error not as expected.')
      })
  })

  it('sets missing hosts overrides', () => {
    return yoTest.run(generator)
      .withLocalConfig({ promptValues })
      .withOptions({sudoOverride: true, hostile})
      .then(() => {
        assert.ok(hostile.getFile.called)
        assert.ok(hostile.get.called)
        assert.ok(hostile.set.calledWith('127.0.0.1', 'local.test.com'))
      })
      .catch((e) => {
        console.error(e)
        assert.notOk(true, 'Generator should not have thrown exception')
      })
  })

  it('remove throws without sudo', () => {
    try {
      generator.Remove()
    } catch (e) {
      assert.include(e.message, 'Generator needs root access to write hosts file')
    }
  })

  it('removes hosts configuration', () => {
    const context = {spawnCommandSync: spy()}
    generator.Remove.apply(context, [true])
    assert.ok(hostile.remove.calledWith('127.0.0.1', 'local.test.com'))
  })
})
