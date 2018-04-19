/* eslint-env jest */
const config = require('config')
const path = require('path')
const { spawnSync } = require('child_process')

const { createDir, rmdir } = require('../../utils/dir')

const { bin: { sprucebotProgram } } = require('../../package.json')

const binFile = path.resolve(sprucebotProgram)
// const program = require('../../actions/platform/index')

const TEMP = `${config.get('TEMP')}/index.test`

const sleep = timeout => new Promise(resolve => setTimeout(resolve, timeout))

describe('Platform bin execution', () => {
	beforeEach(() => {
		createDir(TEMP)
	})
	afterAll(() => {
		rmdir(TEMP)
	})
	// Sleep because these are running after each `test()` finishes
	// TODO determine why spawnSync doesn't seem to be sync
	afterEach(() => sleep(100))

	const runCommand = (argv = []) => {
		return spawnSync(binFile, argv, {
			cwd: TEMP,
			env: {
				...process.env,
				NODE_CONFIG_DIR: path.join(__dirname, '../../config')
			}
		})
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
		expect(output.status).toEqual(0)
	})

	// test('`sprucebot platform configure` should be okay', () => {
	// 	const output = runCommand(['configure'])
	// 	expect(output.stderr.toString()).toContain(
	// 		"Crap! I can't find a valid ecosystem.config.js"
	// 	)
	// 	expect(output.status).toEqual(1)
	// })

	// test('`sprucebot platform start` should be okay', () => {
	// 	const output = runCommand(['start'])
	// 	expect(output.stderr.toString()).toContain(
	// 		"Crap! I can't find a valid ecosystem.config.js"
	// 	)
	// 	expect(output.status).toEqual(1)
	// })

	// Don't check against copy
	// test('`sprucebot platform version` should be okay', () => {
	// 	const output = runCommand(['version'])
	// 	expect(output.stderr.toString()).toContain(
	// 		"Crap! I can't find a valid ecosystem.config.js"
	// 	)
	// 	expect(output.status).toEqual(1)
	// })
})
