const path = require('path')
const fs = require('fs-extra')
const config = require('config')
const chalk = require('chalk')
const { spawnSync } = require('child_process')
const inquirer = require('inquirer')
const hostile = require('hostile')

const checkoutVersion = require('./version')

const { directoryExists, fileExists } = require('../../utils/dir')

async function prompt(options) {
	const prompts = [
		{
			type: 'input',
			name: 'installPath',
			message: 'Install location (absolute path)',
			default: options.installPath,
			store: true
		},
		{
			type: 'input',
			name: 'gitUser',
			message: `Github username. (Developers should use their own. Othewise default is fine.)`,
			default: options.gitUser,
			store: true
		}
	]

	const values = await inquirer.prompt(prompts)

	if (!path.isAbsolute(values.installPath)) {
		throw new Error(
			`Woops, I can only install in an absolute installPath. You supplied ${values.installPath}`
		)
	}
	return values
}

async function writeRepos(installPath, gitUser) {
	console.log('writing repos...', installPath, gitUser)
	const gitBase = `git@github.com:${gitUser}`
	const pathDev = path.resolve(installPath, 'dev-services')
	const pathApi = path.resolve(installPath, 'api')
	const pathWeb = path.resolve(installPath, 'web')

	cloneRepo(`${gitBase}/${config.get('repositories.dev-services')}`, pathDev)
	cloneRepo(`${gitBase}/${config.get('repositories.api')}`, pathApi)
	cloneRepo(`${gitBase}/${config.get('repositories.web')}`, pathWeb)

	yarnInstall(installPath)
	yarnInstall(pathApi)
	yarnInstall(pathWeb)
}

async function cloneRepo(repo, localPath) {
	const exists = directoryExists(localPath)
	if (exists) {
		console.log(
			`Oh snap, looks like you already installed something at ${localPath}! Skipping for now.`
		)
	} else {
		// TODO - Make sure this halts when github public key is missing

		try {
			spawnSync('git', ['clone', repo, localPath], {
				stdio: 'inherit',
				env: process.env
			})
			console.log(chalk.green(`Finished cloning ${repo} to ${localPath}.`))
		} catch (e) {
			console.error(e)
			console.log(
				chalk.bold.red(`CRAP, looks like there was a problem cloning ${repo}.`)
			)
		}
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
	try {
		spawnSync('nvm', ['use'], { cwd, stdio: 'inherit', env: process.env })
		spawnSync('yarn', ['install', '--ignore-engines'], {
			cwd,
			stdio: 'inherit',
			env: process.env
		})
		console.log(chalk.green('Successfully installed project dependencies'), cwd)
	} catch (e) {
		console.error(e)
		console.log(
			chalk.bold.red(`Crap, I had trouble installing with yarn ${cwd}`)
		)
	}
}

module.exports = async function init(
	installPath = `${process.cwd()}/sprucebot`,
	options
) {
	// TODO - Add --select-version option support
	const cliPath = path.resolve(__dirname, '..', '..')
	if (cliPath === process.cwd()) {
		console.error(
			chalk.bold.red(
				'You cannot run `sprucebot platform init` from inside the sprucebot-cli directory.'
			)
		)
		throw new Error('Halting...')
	}

	const promptValues = await prompt({
		installPath,
		gitUser: config.get('gitUser')
	})

	await writeRepos(promptValues.installPath, promptValues.gitUser)

	// Same as `sprucebot platform version` command
	if (options.selectVersion) {
		await checkoutVersion(promptValues.installPath, options)
	}

	const ecoFrom = path.resolve(
		promptValues.installPath,
		'./dev-services/ecosystem.config.js'
	)
	const ecoTo = path.resolve(promptValues.installPath, './ecosystem.config.js')
	await copyFile(ecoFrom, ecoTo)

	const packageFrom = path.resolve(
		promptValues.installPath,
		'./dev-services/package.json'
	)
	const packageTo = path.resolve(promptValues.installPath, './package.json')
	await copyFile(packageFrom, packageTo)

	const webEnvFrom = path.resolve(
		promptValues.installPath,
		'./web/.env.example'
	)
	const webEnvTo = path.resolve(promptValues.installPath, './web/.env')
	if (!fileExists(webEnvTo)) {
		await copyFile(webEnvFrom, webEnvTo)
	} else {
		console.warn(
			chalk.yellow(
				`Careful. An .env already exists in ${webEnvTo}. Proceed with caution...`
			)
		)
	}

	const apiEnvFrom = path.resolve(
		promptValues.installPath,
		'./api/app/.env.example'
	)
	const apiEnvTo = path.resolve(promptValues.installPath, './api/app/.env')
	if (!fileExists(apiEnvTo)) {
		await copyFile(apiEnvFrom, apiEnvTo)
	} else {
		console.warn(
			chalk.yellow(
				`Careful. An .env already exists in ${apiEnvTo}. Proceed with caution...`
			)
		)
	}

	hostile.get(false, (err, lines) => {
		if (err) {
			console.error(
				chalk.bold.red(
					'Oh sh**, I had an issue reading your hosts file. Google `Sprucebot hosts file` for help.'
				)
			)
			throw new Error('Halting...')
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
	})
}
