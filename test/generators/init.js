/* eslint-env mocha */
const path = require('path')
const fs = require('fs')
const {assert} = require('chai')
const {spy} = require('sinon')

const yoTest = require('yeoman-test')

const generator = require('../../generators/init')

const {
  createDir,
  rmdir
} = require('../../utils/dir')

const TEMP = path.join(__dirname, '../../__TEMP__')

describe('Init generator', () => {
  const dir = path.join(TEMP, 'sprucebot')

  beforeEach(() => {
    createDir(dir)
    fs.writeFileSync(path.join(dir, 'docker-compose.yml'), 'version: 3')
  })

  afterEach(() => {
    rmdir(dir)
  })

  it('prompts when options are missing', () => {
    let gen
    return yoTest.run(generator)
      .on('ready', _gen => {
        gen = _gen
        spy(gen, 'prompt')
        spy(gen.config, 'set')
      })
      .then(() => {
        assert.strictEqual(gen.prompt.lastCall.args[0].length, 2)
        assert.strictEqual(gen.prompt.lastCall.args[0][0].name, 'path')
        assert.strictEqual(gen.prompt.lastCall.args[0][1].name, 'gitUser')
      })
  })

  it('uses options if provided', () => {
    let gen
    return yoTest.run(generator)
      .withOptions({
        path: 'test',
        gitUser: 'sprucelabs'
      })
      .on('ready', _gen => {
        gen = _gen
        spy(gen, 'prompt')
        spy(gen.config, 'set')
      })
      .then(() => {
        assert.isNull(gen.prompt.lastCall, 'No prompts are needed when options set')
      })
  })
})
