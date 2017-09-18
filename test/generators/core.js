/* eslint-env mocha */
const fs = require('fs')
const path = require('path')
const {assert} = require('chai')
const {spy, stub} = require('sinon')
const hostile = require('hostile')

const {
  rmdir,
  createDir
} = require('../../utils/dir')
const yoTest = require('yeoman-test')
const yoAssert = require('yeoman-assert')

const TEMP = path.join(__dirname, '../../__TEST__')
const generator = path.join(__dirname, '../../generators/init')

describe('Init Generator', () => {
  const sprucebot = path.join(TEMP, 'sprucebot')
  const promptValues = {
    appname: 'sprucebot',
    path: sprucebot,
    gitUser: 'sprucelabsai'
  }
  beforeEach(() => {
    rmdir(TEMP)
  })
  it('runs with prompts', () => {
    return yoTest.run(generator)
      .withLocalConfig({promptValues})
      .then(() => {
        yoAssert.fileContent('package.json', '"name": "sprucebot"')
        yoAssert.fileContent('docker-compose.yml', 'version: \'3\'')
        yoAssert.file('docker/nginx/Dockerfile')
      })
  })

  it('Syncs git repositories', () => {
    let gen
    return yoTest.run(generator)
      .withLocalConfig({promptValues})
      .withOptions({'skip-install': false})
      .on('ready', generator => {
        gen = generator
        generator.spawnCommandSync = stub().returns({error: null})
      })
      .then(() => {
        // Assert on filesystem here
        gen.spawnCommandSync.calledWith('git', ['clone', 'git@github.com:sprucelabsai/com-sprucebot-hello', path.join(sprucebot, '/web')])
        gen.spawnCommandSync.calledWith('git', ['clone', 'git@github.com:sprucelabsai/com-sprucebot-api', path.join(sprucebot, '/api')])
      })
  })

  it('Copies .env examples', () => {
    createDir(path.join(sprucebot, 'web'))
    createDir(path.join(sprucebot, 'api/app'))
    fs.writeFileSync(path.join(sprucebot, 'web/.env.example'), 'TEST=true')
    fs.writeFileSync(path.join(sprucebot, 'api/app/.env.example'), 'TEST=true')
    return yoTest.run(generator)
      .withLocalConfig({promptValues})
      .withOptions({'skip-install': false})
      .on('ready', generator => {
        generator.spawnCommandSync = stub().returns({error: null})
      })
      .then(() => {
        // Assert on filesystem here
        yoAssert.fileContent('web/.env', 'TEST=true')
        yoAssert.fileContent('api/app/.env', 'TEST=true')
      })
  })

  it('checks if hosts file is properly configured', () => {
    let gen

    function get (arg, callback) {
      callback(null, [
        ['127.0.0.1', 'localhost']
      ])
    }

    stub(hostile, 'get').callsFake(get)
    return yoTest.run(generator)
      .withLocalConfig({promptValues})
      .on('ready', (_gen) => {
        gen = _gen
        gen.log = spy()
      })
      .then(() => {
        assert.ok(hostile.get.called)
        // TODO: find a way to assert without doing a check the string that was logged (changing logs should not fail tests)
        // assert.ok(gen.log.calledWith('I can help you configure it by running `sudo sprucebot platform configure`'))
      })
      .then(() => {
        hostile.get.restore()
      })
  })
})
