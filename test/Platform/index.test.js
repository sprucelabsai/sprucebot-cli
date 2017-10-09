/* eslint-env jest */
const path = require('path')
const CliTest = require('command-line-test')

const { bin: { sprucebotProgram } } = require('../../package.json')

const binFile = path.resolve(sprucebotProgram)

describe('Platform stdin', () => {
	const runCommand = (argv = []) => {
		const cliTest = new CliTest()
		return cliTest.exec(binFile, argv).then(res => {
			expect(res.error).toBeNull()
		})
	}
	test('`sprucebot platform` should be okay', () => {
		return runCommand()
	})

	test('`sprucebot platform -h` should be okay', () => {
		return runCommand(['-h'])
	})

	test('`sprucebot platform init` should be okay', async () => {
		// Need to figure out how to mock user input
		const output = await runCommand(['init'])

		console.log(output)
	})
})
