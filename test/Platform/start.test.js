/* eslint-env jest */
const config = require('config')
const path = require('path')
const fs = require('fs')
const childProcess = require('child_process')
const startAction = require('../../actions/platform/start')
jest.mock('child_process')

const { rmdir, createDir } = require('../../utils/dir')

const TEMP = `${config.get('TEMP')}/start.test`
const cwd = process.cwd()

beforeAll(() => {
	createDir(TEMP)
	process.chdir(TEMP)
	expect(jest.isMockFunction(childProcess.spawnSync)).toBeTruthy()
})
afterAll(() => {
	jest.unmock('child_process')
	process.chdir(cwd)
	rmdir(TEMP)
})

test('throws if no valid ecosystem.config.js file', () => {
	return expect(() => startAction(TEMP)).toThrowError()
})

test('spawns npm start command', () => {
	fs.writeFileSync(path.join(TEMP, 'ecosystem.config.js'))
	expect(() => startAction(TEMP)).not.toThrowError()
	expect(childProcess.spawnSync).toHaveBeenCalledWith(
		'yarn',
		['run', 'start'],
		{
			cwd: process.cwd(),
			stdio: 'inherit'
		}
	)
})

test('spawns in cwd', () => {
	fs.writeFileSync(path.join(TEMP, 'ecosystem.config.js'))
	expect(() => startAction()).not.toThrowError()
	expect(childProcess.spawnSync).toHaveBeenCalledWith(
		'yarn',
		['run', 'start'],
		{
			cwd: process.cwd(),
			stdio: 'inherit'
		}
	)
})
