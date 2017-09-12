/* eslint-env mocha */
const path = require('path')
const { assert } = require('chai')
const { stub } = require('sinon')
const hostile = require('hostile')

const yoTest = require('yeoman-test')
const yoAssert = require('yeoman-assert')

// const generator = path.join(__dirname, '../../generators/configure')
const generator = require('../../generators/configure')

const TEMP = path.join(__dirname, '../../__TEST__')

describe('Configure Generator', () => {
  beforeEach(() => {
    stub(hostile, 'set').returns()
    stub(hostile, 'getFile').returns([['127.0.0.1', 'local.test.com']])
    stub(hostile, 'get').returns([['127.0.0.1', 'test.local']])
  })
  afterEach(() => {
    hostile.set.restore()
    hostile.getFile.restore()
    hostile.get.restore()
  })
  it('requires sudo', () => {
    return yoTest.run(generator)
      .withOptions({ sudoOverride: false })
      .then(() => {
        assert.notOk(true, 'Generator should have thrown exception')
      })
      .catch((e) => {
        assert.equal(e.message, 'Generator needs root access to write hosts file')
      })
  })

  it('sets missing hosts overrides', () => {
    return yoTest.run(generator)
    .withOptions({ sudoOverride: true, hostile })
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

  it('sets loopback alias', () => {
    let gen
    return yoTest.run(generator)
      .withOptions({ sudoOverride: true, hostile })
      .on('ready', (_gen) => {
        gen = _gen
        gen.spawnCommandSync = stub()
        gen.spawnCommandSync
          .withArgs('ifconfig', {})
          .returns({ stdout: '127.0.0.1' })
        gen.spawnCommandSync
          .withArgs('bash', [path.join(TEMP, 'loopbackAlias/setupLoopbackAlias.sh')])
          .returns(true)
      })
      .then(() => {
        yoAssert.file('loopbackAlias/loopbackAlias.sh')
        gen.spawnCommandSync.calledWith('ifconfig', {})
      })
  })
})
