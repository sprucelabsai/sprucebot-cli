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

const configureAction = require('../../actions/platform/configure')

const TEMP = `${config.get('TEMP')}/configure.test`
const repositories = config.get('repositories')

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

	test('prompts for approval', async () => {})
})
