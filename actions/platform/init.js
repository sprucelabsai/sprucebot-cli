const path = require('path')
const fs = require('fs-extra')
const config = require('config')
const chalk = require('chalk')
const childProcess = require('child_process')
const inquirer = require('inquirer')
const hostile = require('hostile')
const { Remote, Repository } = require('nodegit')

const checkoutVersion = require('./version')

const { directoryExists, fileExists } = require('../../utils/dir')

module.exports = async function init(installPath, options = {}) {
	const cliPath = path.resolve(__dirname, '..', '..')
	if (cliPath === process.cwd() && process.env.NODE_ENV !== 'test') {
		console.error(
			chalk.bold.red(
				'You cannot run `sprucebot platform init` from inside the sprucebot-cli directory.'
			)
		)
		throw new Error('Halting...')
	}

	const promptValues = await prompt({
		installPath,
		gitUser: options.gitUser
	})

	await writeRepos(promptValues.installPath, promptValues.gitUser)

	// Same as `sprucebot platform version` command
	if (options.selectVersion) {
		await checkoutVersion(promptValues.installPath, options)
	}

	const devServicesPath = config
		.get('repositories')
		.find(repo => repo.name === 'sprucebot-dev-services').path
	const ecoFrom = path.resolve(
		promptValues.installPath,
		`${devServicesPath}/ecosystem.config.js`
	)
	const ecoTo = path.resolve(promptValues.installPath, './ecosystem.config.js')
	await copyFile(ecoFrom, ecoTo)

	const packageFrom = path.resolve(
		promptValues.installPath,
		`${devServicesPath}/package.json`
	)
	const packageTo = path.resolve(promptValues.installPath, './package.json')
	await copyFile(packageFrom, packageTo)

	await writeEnvs(promptValues.installPath)

	await checkHostile(promptValues)
}

async function prompt(options) {
	const prompts = []

	if (!options.installPath) {
		prompts.push({
			type: 'input',
			name: 'installPath',
			message: 'Install location (absolute path)',
			default: `${process.cwd()}/sprucebot`
		})
	}

	if (!options.gitUser) {
		prompts.push({
			type: 'input',
			name: 'gitUser',
			message: `Github username. (Developers should use their own. Othewise default is fine.)`,
			default: config.get('gitUser')
		})
	}

	const answers = await inquirer.prompt(prompts)
	const values = {
		...options,
		...answers
	}
	if (!path.isAbsolute(values.installPath)) {
		throw new Error(
			`Woops, I can only install in an absolute installPath. You supplied ${values.installPath}`
		)
	}
	return values
}

async function writeRepos(installPath, gitUser) {
	console.log('writing repos...', installPath, gitUser)
	const gitBase = 'git@github.com:'
	const repositories = config.get('repositories')

	for (let repo of repositories) {
		const repoPath = path.resolve(installPath, repo.path)
		const upstream = `${gitBase}${config.get('gitUser')}/${repo.name}`
		const origin = `${gitBase}${gitUser}/${repo.name}`
		await cloneRepo(upstream, repoPath)

		if (upstream !== origin) {
			await updateRepoRemote(repoPath, origin, upstream)
		}

		await yarnInstall(repoPath)
	}
}

async function cloneRepo(repo, localPath) {
	const exists = directoryExists(localPath)
	if (exists) {
		console.log(
			`Oh snap, looks like you already installed something at ${localPath}! Skipping for now.`
		)
	} else {
		const cmd = childProcess.spawnSync('git', ['clone', repo, localPath], {
			stdio: 'inherit',
			env: process.env
		})

		if (cmd.status === 0) {
			console.log(chalk.green(`Finished cloning ${repo} to ${localPath}.`))
		} else {
			console.log(
				chalk.bold.red(`CRAP, looks like there was a problem cloning ${repo}.`)
			)
		}
	}
}

async function updateRepoRemote(repoPath, origin, upstream) {
	let repo
	try {
		repo = await Repository.open(repoPath)
	} catch (e) {
		if (process.env.NODE_ENV === 'test') {
			repo = await Repository.init(repoPath, 0)
		} else {
			throw new Error(e)
		}
	}
	if (repo) {
		await Remote.delete(repo, 'origin').catch(() => {})
		await Remote.delete(repo, 'upstream').catch(() => {})
		await Remote.create(repo, 'origin', origin)
		await Remote.create(repo, 'upstream', upstream)
		console.log(chalk.green(`Successfully created git remote origin ${origin}`))
		console.log(
			chalk.green(`Successfully created git remote upstream ${upstream}`)
		)
	}
}

async function copyFile(fromFile, toFile) {
	try {
		fs.copySync(fromFile, toFile)
		console.log(chalk.green(`Successfully created ${toFile}`))
	} catch (e) {
		console.error(e)
		console.log(
			chalk.bold.red(
				`CRAP, I had trouble copying your ecosystem file ${fromFile}`
			)
		)
	}
}

async function yarnInstall(cwd) {
	childProcess.spawnSync('nvm', ['use'], {
		cwd,
		stdio: 'inherit',
		env: process.env
	})
	const cmd = childProcess.spawnSync('yarn', ['install', '--ignore-engines'], {
		cwd,
		stdio: 'inherit',
		env: process.env
	})

	if (cmd.status === 0) {
		console.log(chalk.green('Successfully installed project dependencies'), cwd)
	} else {
		console.log(
			chalk.bold.red(`Crap, I had trouble installing with yarn ${cwd}`)
		)
	}
}

async function writeEnvs(installPath) {
	const webEnvFrom = path.resolve(installPath, './web/.env.example')
	const webEnvTo = path.resolve(installPath, './web/.env')
	if (!fileExists(webEnvTo)) {
		await copyFile(webEnvFrom, webEnvTo)
	} else {
		console.warn(
			chalk.yellow(
				`Careful. An .env already exists in ${webEnvTo} Proceed with caution...`
			)
		)
	}

	const apiEnvFrom = path.resolve(installPath, './api/app/.env.example')
	const apiEnvTo = path.resolve(installPath, './api/app/.env')
	if (!fileExists(apiEnvTo)) {
		await copyFile(apiEnvFrom, apiEnvTo)
	} else {
		console.warn(
			chalk.yellow(
				`Careful. An .env already exists in ${apiEnvTo} Proceed with caution...`
			)
		)
	}

	const relayEnvFrom = path.resolve(
		installPath,
		'./sprucebot-relay/.env.sample'
	)
	const relayEnvTo = path.resolve(installPath, './sprucebot-relay/.env')
	if (!fileExists(relayEnvTo)) {
		await copyFile(relayEnvFrom, relayEnvTo)
	} else {
		console.warn(
			chalk.yellow(
				`Careful. An .env already exists in ${relayEnvTo} Proceed with caution...`
			)
		)
	}
}

async function checkHostile(promptValues) {
	return new Promise((resolve, reject) => {
		hostile.get(false, (err, lines) => {
			if (err) {
				console.error(
					chalk.bold.red(
						'Oh sh**, I had an issue reading your hosts file. Google `Sprucebot hosts file` for help.'
					)
				)
				reject(err)
			}
			const configured = lines.reduce((memo, line) => {
				if (/sprucebot/.test(line[1])) {
					memo[line[1]] = true
				}
				return memo
			}, {})
			// Help dev cd to correct directory
			let dir = path.basename(promptValues.installPath)
			if (
				!configured['local-api.sprucebot.com'] ||
				!configured['local.sprucebot.com'] ||
				!configured['local-devtools.sprucebot.com'] ||
				!configured['sprucebot_postgres'] ||
				!configured['sprucebot_redis']
			) {
				console.log(
					chalk.green(
						`Sweet! We're almost done! Last step is configuring your host file.`
					)
				)
				console.log(
					chalk.yellow(
						`Don't sweat it though, run \`cd ${dir} && sudo sprucebot platform configure\``
					)
				)
			} else {
				console.log(
					chalk.green('Heck yeah! I double checked and everything looks good.')
				)
				console.log(
					chalk.yellow(`Run \`cd ${dir} && sprucebot platform start\`  🌲 🤖`)
				)
			}

			resolve()
		})
	})
}
