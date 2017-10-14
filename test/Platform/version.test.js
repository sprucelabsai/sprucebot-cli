/* eslint-env jest */
const fs = require('fs-extra')
const path = require('path')
const config = require('config')
const { createDir, rmdir } = require('../../utils/dir')
const { Repository } = require('nodegit')

const versionAction = require('../../actions/platform/version')

const TEMP = config.get('TEMP')
const repositories = config.get('repositories')

describe('version command', () => {
	beforeEach(async () => {
		createDir(TEMP)
		fs.writeFileSync(path.join(TEMP, 'ecosystem.config.js'), '')
		for (let repo of repositories) {
			const gitPath = path.join(TEMP, repo.path)
			createDir(gitPath)
			await Repository.init(gitPath, 0)
		}
	})
	// afterEach(() => rmdir(TEMP))

	test('throws when no ecosystem', async () => {
		fs.unlinkSync(path.join(TEMP, 'ecosystem.config.js'))
		return expect(versionAction(TEMP)).rejects.toEqual(
			expect.objectContaining(Error('Halting...'))
		)
	})

	test('defaults to HEAD', async () => {
		await expect(versionAction(TEMP)).rejects.toEqual(
			expect.objectContaining(Error(`reference 'refs/heads/master' not found`))
		)
	})
	test.skip('lists tags')
})
