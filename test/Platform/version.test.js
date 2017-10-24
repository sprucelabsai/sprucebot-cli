/* eslint-env jest */
const fs = require('fs-extra')
const path = require('path')
const config = require('config')
const { createDir, rmdir } = require('../../utils/dir')
const { Repository, Tag, Signature } = require('nodegit')
const inquirer = require('inquirer')
jest.mock('inquirer')

const versionAction = require('../../actions/platform/version')

const TEMP = `${config.get('TEMP')}/version.test`
const repositories = config.get('repositories')

describe('version command', () => {
	beforeEach(async () => {
		createDir(TEMP)
		fs.writeFileSync(path.join(TEMP, 'ecosystem.config.js'), '')
		for (let repo of repositories) {
			const gitPath = path.join(TEMP, repo.path)
			createDir(gitPath)
			const repository = await Repository.init(gitPath, 0)
			repo.repository = repository
			const sig = Signature.now('Sprucebot', 'founders@sprucelabs.ai')
			const commit = await repository.createCommitOnHead(
				[],
				sig,
				sig,
				'Master commit'
			)
		}
	})
	afterEach(() => rmdir(TEMP))

	test('throws when no ecosystem', async () => {
		fs.unlinkSync(path.join(TEMP, 'ecosystem.config.js'))
		return expect(versionAction(TEMP)).rejects.toEqual(
			expect.objectContaining(Error('Halting...'))
		)
	})

	test('defaults to HEAD', async () => {
		await expect(versionAction(TEMP)).resolves.toEqual(
			expect.objectContaining({
				'com-sprucebot-apiVersion': 'refs/heads/master',
				'com-sprucebot-webVersion': 'refs/heads/master',
				'sprucebot-dev-servicesVersion': 'refs/heads/master',
				'sprucebot-relayVersion': 'refs/heads/master'
			})
		)
	})

	test('uses tags if available', async () => {
		await Promise.all(
			repositories.map(async repo => {
				const masterCommit = await repo.repository.getMasterCommit()
				return repo.repository.createTag(
					masterCommit,
					`${repo.name}-customTag`,
					'tag commit message'
				)
			})
		)

		await expect(versionAction(TEMP)).resolves.toEqual(
			expect.objectContaining({
				'com-sprucebot-apiVersion': 'com-sprucebot-api-customTag',
				'com-sprucebot-webVersion': 'com-sprucebot-web-customTag',
				'sprucebot-dev-servicesVersion': 'sprucebot-dev-services-customTag',
				'sprucebot-relayVersion': 'sprucebot-relay-customTag'
			})
		)

		expect(inquirer.prompt).toHaveBeenCalledWith(
			expect.arrayContaining([expect.objectContaining({ type: 'list' })])
		)
	})
})
