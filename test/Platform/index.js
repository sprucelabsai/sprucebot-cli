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

const platform = require('../../actions/platform')

describe('Platform stdin', () => {
  function runCommand (argv = []) {
    const cliTest = new CliTest()
    return cliTest.execFile(binFile, argv).then(res => {
      assert.isNull(res.error)
    })
  }
  it('`sprucebot platform` should be okay', () => {
    return runCommand()
  })

  it('`sprucebot platform -h` should be okay', () => {
    return runCommand(['-h'])
  })

  xit('`sprucebot platform init` should be okay', () => {
    // Need to figure out how to mock user input
    return runCommand(['init'])
  })
})

describe('Platform', () => {
  it('--dev', () => {
    const program = platform(['sprucebot', 'platform', '--dev'])
    assert.isTrue(program.dev)
  })
  it('init', () => {
    platform(['sprucebot', 'platform', 'init'])
    assert.ok(true)
    // Test init files here
  })
})
