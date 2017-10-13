/* eslint-env jest */
const config = require('config')
const path = require('path')
const { spawnSync } = require('child_process')

const { createDir, rmdir } = require('../../utils/dir')

const { bin: { sprucebotProgram } } = require('../../package.json')

const binFile = path.resolve(sprucebotProgram)
const program = require('../../actions/platform/index')

const TEMP = config.get('TEMP')

const sleep = timeout => new Promise(resolve => setTimeout(resolve, timeout))
// Override the NODE_CONFIG DIR if not set
// This allows us to use the cli from any directory
process.env.NODE_CONFIG_DIR =
	process.env.NODE_CONFIG_DIR || path.join(__dirname, '../../config')

describe('Platform bin execution', () => {
	beforeAll(() => sleep(1000))
	beforeEach(() => {
		createDir(TEMP)
	})
	afterEach(() => {
		rmdir(TEMP)
	})

	const runCommand = (argv = []) => {
		return spawnSync(binFile, argv, { cwd: TEMP })
	}

	test('`sprucebot platform -h` should be okay', () => {
		const output = runCommand(['-h'])
		expect(output.stderr.toString()).toEqual('')
		expect(output.stdout.toString()).toContain('Usage: sprucebot-platform')
		expect(output.status).toEqual(0)
	})

	test('`sprucebot platform init` should be okay', () => {
		// Need to figure out how to mock user input
		const output = runCommand(['init'])
		expect(output.stderr.toString()).toEqual('')
		expect(output.status).toEqual(null)
	})

	test('`sprucebot platform configure` should be okay', () => {
		const output = runCommand(['configure'])
		expect(output.stderr.toString()).toContain(
			"Crap! I can't find a valid ecosystem.config.js"
		)
		expect(output.status).toEqual(0)
	})

	test('`sprucebot platform start` should be okay', () => {
		const output = runCommand(['start'])
		expect(output.stderr.toString()).toContain(
			"Crap! I can't find a valid ecosystem.config.js"
		)
	})

	test('`sprucebot platform version` should be okay', () => {
		const output = runCommand(['version'])
		expect(output.stderr.toString()).toContain(
			"Crap! I can't find a valid ecosystem.config.js"
		)
		expect(output.status).toEqual(0)
	})
})

describe('Platform commander configuration', () => {
	test('program contains expected commands', () => {
		program(['node', sprucebotProgram]).commands.forEach(command => {
			expect(command._name).toEqual(
				expect.stringMatching(
					/configure|init|version|start|rebuild|remove|owner:create/
				)
			)
		})
	})
})
