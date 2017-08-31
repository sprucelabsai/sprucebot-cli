/* eslint-env mocha */
const path = require('path')
const { assert } = require('chai')
const CliTest = require('command-line-test')

const {
 bin: {
  sprucebotProgram
 }
} = require('../../package.json')

const binFile = path.resolve(sprucebotProgram)

describe('Platform', () => {
  it('`sprucebot platform` should be okay', () => {
    const cliTest = new CliTest()
    return cliTest.execFile(binFile).then(res => {
      assert.isNull(res.error)
    })
  })

  it('`sprucebot platform -h` gives a helping hand', () => {
    const cliTest = new CliTest()
    return cliTest.execFile(binFile, ['-h']).then(res => {
      assert.isNull(res.error)
      assert.include(res.stdout, 'Usage: sprucebot-platform [options] [command]')
    })
  })
})
