/* eslint-env mocha */
const fs = require('fs')
const path = require('path')
const { assert } = require('chai')
const { spy, stub } = require('sinon')
const hostile = require('hostile')

const {
  rmdir,
  createDir
} = require('../../utils/dir')
const yoTest = require('yeoman-test')
const yoAssert = require('yeoman-assert')

const TEMP = path.join(__dirname, '../../__TEST__')
const generator = path.join(__dirname, '../../generators/core')

describe('Core Generator', () => {
  beforeEach(() => {
    rmdir(TEMP)
  })
  it('runs with prompts', () => {
    return yoTest.run(generator)
      .withPrompts({
        path: path.join(TEMP, 'sprucebot'),
        gitUser: 'sprucelabsai'
      })
      .then(() => {
        yoAssert.fileContent('package.json', '"name": "sprucebot"')
        yoAssert.fileContent('docker-compose.yml', 'version: \'3\'')
        yoAssert.file('docker/nginx/Dockerfile')
      })
  })

  it('Syncs git repositories', () => {
    let gen
    const sprucebot = path.join(TEMP, 'sprucebot')
    return yoTest.run(generator)
      .withOptions({ 'skip-install': false })
      .withPrompts({
        path: sprucebot,
        gitUser: 'sprucelabsai'
      })
      .on('ready', generator => {
        gen = generator
        generator.spawnCommandSync = spy()
      })
      .then(() => {
        // Assert on filesystem here
        gen.spawnCommandSync.calledWith('git', ['clone', 'git@github.com:sprucelabsai/com-sprucebot-hello', path.join(sprucebot, '/web')])
        gen.spawnCommandSync.calledWith('git', ['clone', 'git@github.com:sprucelabsai/com-sprucebot-api', path.join(sprucebot, '/api')])
      })
  })

  it('Copies .env examples', () => {
    const sprucebot = path.join(TEMP, 'sprucebot')
    createDir(path.join(sprucebot, 'web'))
    createDir(path.join(sprucebot, 'api/app'))
    fs.writeFileSync(path.join(sprucebot, 'web/.env.example'), 'TEST=true')
    fs.writeFileSync(path.join(sprucebot, 'api/app/.env.example'), 'TEST=true')
    return yoTest.run(generator)
      .withOptions({ 'skip-install': false })
      .withPrompts({
        path: sprucebot,
        gitUser: 'sprucelabsai'
      })
      .on('ready', generator => {
        generator.spawnCommandSync = spy()
      })
      .then(() => {
        // Assert on filesystem here
        yoAssert.fileContent('web/.env', 'TEST=true')
        yoAssert.fileContent('api/app/.env', 'TEST=true')
      })
  })

  it('checks if hosts file is properly configured', () => {
    let gen
    const sprucebot = path.join(TEMP, 'sprucebot')
    function get (arg, callback) {
      callback(null, [
        ['127.0.0.1', 'localhost']
      ])
    }
    stub(hostile, 'get').callsFake(get)
    return yoTest.run(generator)
      .withPrompts({
        path: sprucebot,
        gitUser: 'sprucelabsai'
      })
      .on('ready', (_gen) => {
        gen = _gen
        gen.log = spy()
      })
      .then(() => {
        assert.ok(hostile.get.called)
        assert.ok(gen.log.calledWith('I can help you configure it by running `sudo sprucebot platform configure`'))
      })
      .then(() => {
        hostile.get.restore()
      })
  })
})
