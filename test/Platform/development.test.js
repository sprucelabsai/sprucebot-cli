/* eslint-env jest */
const fs = require('fs-extra')
const path = require('path')
const config = require('config')
const { createDir, rmdir } = require('../../utils/dir')
const inquirer = require('inquirer')
const hostile = require('hostile')
const { spawnSync } = require('child_process')
jest.mock('inquirer')
jest.mock('hostile')
jest.mock('child_process')

const configureAction = require('../../actions/platform/development')

const TEMP = `${config.get('TEMP')}/configure.test`
const platforms = config.get('platforms')

describe.only('configure command', () => {
	beforeEach(async () => {
		createDir(TEMP)
		fs.writeFileSync(path.join(TEMP, 'ecosystem.config.js'), '')
	})
	afterEach(() => rmdir(TEMP))

	test('throws when no ecosystem', async () => {
		fs.unlinkSync(path.join(TEMP, 'ecosystem.config.js'))
		return expect(configureAction(TEMP)).rejects.toEqual(
			expect.objectContaining(Error('Halting...'))
		)
	})

	test('prompts for approval', async () => {
		// await expect(configureAction(TEMP)).resolves.toEqual()
		// expect(inquirer.prompt).toHaveBeenCalledWith(
		// 	expect.arrayContaining([
		// 		expect.objectContaining({
		// 			name: 'loopback',
		// 			type: 'confirm'
		// 		}),
		// 		expect.objectContaining({
		// 			name: 'hosts',
		// 			type: 'confirm'
		// 		}),
		// 		expect.objectContaining({
		// 			name: 'certificate',
		// 			type: 'confirm'
		// 		})
		// 	])
		// )
	})

	test('Adds missing lines to hosts file', async () => {
		// hostile._setHosts([['127.0.0.1', 'local.test']])
		// hostile._setFileHosts([['127.0.0.1', 'missing.host']])
		// await expect(configureAction(TEMP)).resolves.toEqual()
		// expect(hostile.set).toHaveBeenCalledWith('127.0.0.1', 'missing.host')
	})

	test('runs loopback script', async () => {
		// await expect(configureAction(TEMP)).resolves.toEqual()
		// expect(spawnSync).toHaveBeenCalledWith('sh', ['setupLoopbackAlias.sh'], {
		// 	cwd: `${TEMP}/dev-services/scripts/loopbackAlias`,
		// 	stdio: 'inherit'
		// })
	})

	test('runs security certificate script', async () => {
		// await expect(configureAction(TEMP)).resolves.toEqual()
		// expect(spawnSync).toHaveBeenCalledWith('sh', ['setupRootCertificate.sh'], {
		// 	cwd: `${TEMP}/dev-services/scripts/certificate`,
		// 	stdio: 'inherit'
		// })
	})
})
