/* eslint-env jest */
const config = require('config')
const path = require('path')
const fs = require('fs')

const { rmdir, createDir } = require('../../utils/dir')

const TEMP = config.get('TEMP')

describe('Start action', () => {
	let startAction
	let spawnSync
	beforeEach(() => {
		createDir(TEMP)
		jest.mock('child_process', () => require('../__mocks__/child_process'))
		spawnSync = require('child_process').spawnSync
		startAction = require('../../actions/platform/start')
		expect(jest.isMockFunction(spawnSync)).toBeTruthy()
	})
	afterEach(() => {
		rmdir(TEMP)
		jest.unmock('child_process')
		spawnSync = require('child_process').spawnSync
		expect(jest.isMockFunction(spawnSync)).toBeFalsy()
	})
	test('throws if no valid ecosystem.config.js file', () => {
		expect(() => startAction(TEMP)).toThrowError()
	})

	test('spawns npm start command', () => {
		fs.writeFileSync(path.join(TEMP, 'ecosystem.config.js'))
		expect(() => startAction(TEMP)).not.toThrowError()
		expect(spawnSync).toHaveBeenCalledWith('yarn', ['run', 'start'], {
			cwd: process.cwd(),
			stdio: 'inherit'
		})
	})
})
