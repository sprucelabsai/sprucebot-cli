/* eslint-env jest */
const fs = require('fs')
const config = require('config')
const inquirer = require('inquirer')
const childProcess = require('child_process')
jest.mock('child_process')
jest.mock('inquirer')
const initAction = require('../../actions/platform/init')
const { rmdir } = require('../../utils/dir')

process.on('unhandledRejection', (reason, p) => {
	console.log('Unhandled Rejection at:', p, 'reason:', reason)
})

const TEMP = config.get('TEMP')
const cwd = process.cwd()
beforeEach(() => {
	rmdir(TEMP)
	if (!fs.existsSync(TEMP)) fs.mkdirSync(TEMP)
	process.chdir(TEMP)
	inquirer.prompt.mockClear()
	childProcess.spawnSync.mockClear()
})
afterEach(() => {
	process.chdir(cwd)
})
afterAll(() => {
	jest.unmock('inquirer')
	jest.unmock('child_process')
})

test.only('prompts when options are missing', async () => {
	await initAction()
	expect(inquirer.prompt).toHaveBeenCalledWith([
		{
			default: `${process.cwd()}/sprucebot`,
			message: 'Install location (absolute path)',
			name: 'installPath',
			type: 'input'
		},
		{
			default: 'sprucelabsai',
			message:
				'Github username. (Developers should use their own. Othewise default is fine.)',
			name: 'gitUser',
			type: 'input'
		}
	])
	expect(childProcess.spawnSync === initAction.spawnSync).toBeTruthy()
	expect(childProcess.spawnSync).toHaveBeenCalled()
})

test('uses options if provided', async () => {
	const installPath = `${TEMP}/spTeset`
	await initAction(installPath, { gitUser: 'test' })
	expect(inquirer.prompt).toHaveBeenCalledWith([])
	expect(jest.isMockFunction(childProcess.spawnSync)).toBeTruthy()
	expect(childProcess.spawnSync).toHaveBeenCalled()
})

test.skip('runs with prompts', () => {})

test.skip('Syncs git repositories', () => {})

test.skip('Fails when repo 404', () => {})

test.skip('sets git remote upstream', () => {})

test.skip('Copies .env examples', () => {})

test.skip('checks if hosts file is properly configured', () => {})
