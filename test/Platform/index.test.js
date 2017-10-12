/* eslint-env jest */
const config = require('config')
const path = require('path')
const CliTest = require('command-line-test')

const { createDir, rmdir } = require('../../utils/dir')

const { bin: { sprucebotProgram } } = require('../../package.json')

const binFile = path.resolve(sprucebotProgram)

const TEMP = config.get('TEMP')

beforeEach(() => {
	createDir(TEMP)
})
afterEach(() => {})
const runCommand = async (argv = []) => {
	const cliTest = new CliTest()
	return await cliTest.execFile(binFile, argv, { cwd: TEMP })
}

test('`sprucebot platform -h` should be okay', async () => {
	const output = await runCommand(['-h'])
	expect(output.error).toBeNull()
	expect(output.stdout).toContain('Usage: sprucebot-platform')
})

test('`sprucebot platform init` should be okay', async () => {
	// Need to figure out how to mock user input
	const output = await runCommand(['init'])
	expect(output.error).toBeNull()
})

test('`sprucebot platform configure` should be okay', async () => {
	const output = await runCommand(['configure'])
	expect(output.error).toBeNull()
})

test('`sprucebot platform start` should be okay', async () => {
	const output = await runCommand(['start'])
	expect(output.error.message).toContain(
		"Crap! I can't find a valid ecosystem.config.js"
	)
})

test('`sprucebot platform version` should be okay', async () => {
	const output = await runCommand(['version'])
	expect(output.error).toBeNull()
})
