/* eslint-env jest */
const fs = require('fs')
const path = require('path')
const config = require('config')
const inquirer = require('inquirer')
const childProcess = require('child_process')
const hostile = require('hostile')
jest.mock('child_process')
jest.mock('inquirer')
jest.mock('hostile')
const initAction = require('../../actions/platform/install')
const { rmdir, createDir } = require('../../utils/dir')

process.on('unhandledRejection', (reason, p) => {
	console.log('Unhandled Rejection at:', p, 'reason:', reason)
})

const platforms = config.get('platforms')
const TEMP = `${config.get('TEMP')}/init.test`
const cwd = process.cwd()

describe('Init Action', () => {
	beforeEach(() => {
		createDir(TEMP)
		process.chdir(TEMP)
		inquirer.prompt.mockClear()
		childProcess.spawnSync.mockClear()
		expect(jest.isMockFunction(childProcess.spawnSync)).toBeTruthy()
	})
	afterEach(() => {
		process.chdir(cwd)
		rmdir(TEMP)
	})
	afterAll(() => {
		jest.unmock('inquirer')
		jest.unmock('child_process')
		jest.unmock('hostile')
	})

	test('prompts when options are missing', async () => {
		await initAction()
		// tests dependend on exact verbiage are testing the wrong thing
		// find a different way to test this
		// expect(inquirer.prompt).toHaveBeenCalledWith([
		// 	{
		// 		default: `${TEMP}/sprucebot`,
		// 		message: 'Install location (absolute path)',
		// 		name: 'installPath',
		// 		type: 'input'
		// 	},
		// 	{
		// 		default: 'sprucelabsai',
		// 		message:
		// 			'Github username. (Developers should use their own. Othewise default is fine.)',
		// 		name: 'gitUser',
		// 		type: 'input'
		// 	}
		// ])
		expect(childProcess.spawnSync).toHaveBeenCalled()
	})

	//Tests against exact verbiage
	//test('Does not clone if directory exists', async () => {
	// 	const installPath = `${TEMP}/spExists`
	// 	fs.mkdirSync(installPath)
	// 	// init checks if repo dir exists
	// 	for (let key in platforms) {
	// 		const repo = platforms[key].repo
	// 		const cpyPath = path.join(installPath, repo.path)
	// 		childProcess.spawnSync(
	// 			'git',
	// 			['clone', `git@github.com:sprucelabsai/${repo.name}`, cpyPath],
	// 			{
	// 				cwd: installPath
	// 			}
	// 		)
	// 	}

	// 	const oldLog = console.log
	// 	console.log = jest.fn((...args) => oldLog(...args))
	// 	await initAction(installPath, { gitUser: 'test' })

	// 	Object.keys(platforms).forEach(key => {
	// 		let repo = platforms[key].repo
	// 		expect(console.log).toHaveBeenCalledWith(
	// 			expect.stringContaining(
	// 				`Oh snap, looks like you already installed something at ${path.join(
	// 					installPath,
	// 					repo.path
	// 				)}`
	// 			)
	// 		)
	// 	})

	// 	console.log = oldLog
	// })

	describe('Successful run', () => {
		const installPath = `${TEMP}/spTeset`

		beforeEach(async () => {
			rmdir(installPath)
			await initAction(installPath, { gitUser: 'test' })
			expect(fs.existsSync(installPath)).toBeTruthy()
			// expect(inquirer.prompt).toHaveBeenCalledWith([]) prompts have changed
		})

		test('Syncs git repositories', () => {
			Object.keys(platforms).forEach(key => {
				const repo = platforms[key].repo
				const repoUrl = `git@github.com:${config.get('gitUser')}/${repo.name}`
				expect(childProcess.spawnSync).toHaveBeenCalledWith(
					'git',
					['clone', repoUrl, path.join(installPath, repo.path)],
					{
						stdio: 'inherit',
						env: process.env
					}
				)
			})
		})

		// These tests rely on above tests (some commented out) - all setup/teardown needs to happen each test
		// test('sets git remote upstream', async () => {
		// 	for (let key in platforms) {
		// 		const repo = platforms[key].repo
		// 		const repository = await Repository.open(
		// 			path.join(installPath, repo.path)
		// 		)
		// 		const remotes = await Remote.list(repository)
		// 		expect(remotes).toEqual(expect.arrayContaining(['origin', 'upstream']))
		// 	}
		// })

		// test('Copies .env examples', () => {
		// 	expect(fs.existsSync(path.join(installPath, 'web/.env'))).toBeTruthy()
		// 	expect(fs.existsSync(path.join(installPath, 'api/app/.env'))).toBeTruthy()
		// 	expect(
		// 		fs.existsSync(path.join(installPath, 'sprucebot-relay/.env'))
		// 	).toBeTruthy()
		// })

		// test('Installs yarn dependencies', () => {
		// 	repositories.forEach(repo => {
		// 		expect(childProcess.spawnSync).toHaveBeenCalledWith(
		// 			'yarn',
		// 			['install', '--ignore-engines'],
		// 			{
		// 				cwd: path.join(installPath, repo.path),
		// 				env: process.env,
		// 				stdio: 'inherit'
		// 			}
		// 		)
		// 	})
		// })

		// test('checks if hosts file is properly configured', () => {
		// 	expect(hostile.get).toHaveBeenCalled()
		// })
	})
})
