const path = require('path')
const fs = require('fs-extra')
const config = require('config')
const chalk = require('chalk')
const childProcess = require('child_process')
const inquirer = require('inquirer')
const hostile = require('hostile')

const Git = require('../../utils/Git')
const checkoutVersion = require('./version')
const untildify = require('untildify')

const { directoryExists, fileExists } = require('../../utils/dir')

module.exports = async function init(startingPath = false, options = {}) {
	// Check okay status on following commands
	if (process.env.NODE_ENV !== 'test') {
		checkDependenciesInstalled([
			{
				exectable: 'psql',
				args: ['-V'],
				message:
					'I work better with friends! 🤖. Please install Postgres. https://www.postgresql.org/download/'
			},
			{
				exectable: 'docker',
				args: ['-v'],
				message:
					'I work better with friends! 🤖. Please install Docker. https://docs.docker.com/docker-for-mac/install/'
			},
			{
				exectable: 'yarn',
				args: ['-v'],
				message:
					'I work better with friends! 🤖. Please install yarn. https://yarnpkg.com/en/docs/install'
			}
		])
	}
	const platform = options.platform || 'coredev'
	const cliPath = path.resolve(__dirname, '..', '..')

	const installPath = startingPath || './sprucebot'
	const destination =
		installPath[0] === `~` ? untildify(installPath) : path.resolve(installPath)

	if (destination.search(cliPath) === 0 && process.env.NODE_ENV !== 'test') {
		console.error(
			chalk.bold.red(
				'You cannot run `sprucebot platform init` from inside the sprucebot-cli directory.'
			)
		)
		throw new Error('Halting...')
	}
	const promptValues = await prompt({
		installPath: destination,
		gitUser: options.username
	})

	const platforms = config.get('platforms')

	yarnInstall(promptValues.installPath)

	for (let key in platforms) {
		coredev = !!config.get(`platforms.${key}.repo.coredev`)

		if (platform === 'all' || key == platform || (platform == 'coredev' && coredev)) {
			// if we are installing everything, they each go in their own subdir
			const platformPath = path.resolve(
				promptValues.installPath,
				platform === 'all' || platform === 'coredev' ? config.get(`platforms.${key}.repo.path`) : './'
			)

			// do we need to fetch the platform?
			const exists = fileExists(path.join(platformPath, 'package.json'))

			if (exists) {
				console.log(`Oh cool, ${key} is already installed. Skipping.`)
			} else {
				console.log(
					`Fetching ${key} to`,
					installPath,
					'with git user',
					promptValues.gitUser
				)
				// fetch the code
				await fetchPlatform(
					platformPath,
					platforms[key].repo.name,
					promptValues.gitUser
				)
				console.log(chalk.green('Fetching successful.'))
			}

			// Same as `sprucebot platform version` command
			if (options.selectVersion) {
				await checkoutVersion(key, { ...options, cwd: platformPath })
			} else if (options.branch) {
				console.log(`Checking out ${options.branch} branch`)

				//we need to fetch ustream if we are not sprucelabs
				if (options.gitUser !== 'sprucelabsai') {
					const cmd = childProcess.spawnSync('git', ['fetch', 'upstream'], {
						env: process.env,
						cwd: platformPath
					})
				}

				const cmd = childProcess.spawnSync(
					'git',
					['checkout', options.branch],
					{
						stdio: 'inherit',
						env: process.env,
						cwd: platformPath
					}
				)
				console.log(chalk.green('Done!'))
			}

			console.log('Installing dependencies.  🤞 ')

			// install the code
			if (!yarnInstall(platformPath)) {
				console.log(
					chalk.bold.red(
						`Crap, I had trouble with ${'`yarn install`'} in ${platformPath}. See error above for more deets.`
					)
				)
				return // what do we do here?
			} else {
				console.log(
					chalk.green(
						`Successfully installed ${key}'s dependencies. Moving onto environment files.`
					)
				)
			}

			//copy some environment files
			let envPath = config.get(`platforms.${key}.repo.env`)
			if (envPath) {
				let success = await writeEnv(path.join(platformPath, envPath))
				if (success) {
				} else {
					console.warn(
						chalk.yellow(
							`Wait, a .env already exists! Why the shit didn't you just run ${'`sprucebot platform update`'}?`
						)
					)
				}
			}

			console.log('Moving on.')
		}
	}

	let command = 'sprucebot platform start' // the final command to be suggested at the end

	// only do dev services if we are install "all" - otherwise assume on-premise hosting
	if (platform === 'all' || platform === 'coredev') {
		console.log(
			`Ok, since you are clearly a dev, let's get your dev environment ready.`
		)
		const devServicesPath = config.get('platforms.dev.repo.path')

		const workspaceFrom = path.resolve(
			promptValues.installPath,
			`${devServicesPath}/workspace`
		)
		const workspaceTo = path.resolve(promptValues.installPath)
		await copyFile(workspaceFrom, workspaceTo)

		yarnInstall(promptValues.installPath)

		console.log(chalk.green('Checking hosts to determine next step.'))

		let hasHostFile = await checkHostile(promptValues)

		if (!hasHostFile) {
			command = 'sprucebot platform config'
		}
	}

	if (!startingPath || startingPath[0] !== '.') {
		command = `cd ${installPath} && ${command}`
	}

	console.log(chalk.green('Hell yeah, all done!  🌲 🤖'))
	console.log(chalk.yellow('Run `' + command + '` '))
}

async function prompt(options) {
	const prompts = []

	if (!options.installPath) {
		prompts.push({
			type: 'input',
			name: 'installPath',
			message: 'Install location',
			default: `./sprucebot`
		})
	}

	if (!options.gitUser) {
		prompts.push({
			type: 'input',
			name: 'gitUser',
			message: `Github username. (Developers should use their own. You should fork the repo.)`,
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
			`Woops, I can only install in an absolute installPath. You supplied ${
				values.installPath
			}`
		)
	}
	return values
}

async function fetchPlatform(installPath, repoName, gitUser) {
	const gitBase = 'git@github.com:'
	const upstream = `${gitBase}${config.get('gitUser')}/${repoName}`
	const origin = `${gitBase}${gitUser}/${repoName}`

	await cloneRepo(upstream, installPath)

	if (upstream !== origin) {
		await updateRepoRemote(installPath, origin, upstream)
	}
}

/**
 * Checks if the supplied commands are available in PATH
 * and makes sure they return status === 0
 *
 * @param {Array} commands
 * @returns {void} Exits if any command returns status >=1
 */
async function checkDependenciesInstalled(commands) {
	commands.forEach(({ exectable, args, message }) => {
		const cmd = childProcess.spawnSync(exectable, args, {
			stdio: 'inherit',
			env: process.env
		})
		if (cmd.status !== 0) {
			console.log(chalk.red(message))
			process.exit(1)
		}
	})
}

async function cloneRepo(repo, localPath) {
	const cmd = childProcess.spawnSync('git', ['clone', repo, localPath], {
		stdio: 'inherit',
		env: process.env
	})

	if (cmd.status === 0) {
		console.log(chalk.green(`Finished cloning ${repo} to ${localPath}`))
	} else {
		console.log(
			chalk.bold.red(`CRAP, looks like there was a problem cloning ${repo}.`)
		)
	}
}

async function updateRepoRemote(repoPath, origin, upstream) {
	Git.Remote.delete(repoPath, 'origin')
	Git.Remote.delete(repoPath, 'upstream')
	const errors = [
		Git.Remote.create(repoPath, 'origin', origin),
		Git.Remote.create(repoPath, 'upstream', upstream)
	].filter(cmd => cmd instanceof Error)
	if (errors.length) {
		console.log(
			chalk.red('CRAP, I had an issue updating the repo remotes'),
			repoPath,
			chalk.red(errors)
		)
	} else {
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

function yarnInstall(cwd) {
	// this does not work, does it?
	childProcess.spawnSync('nvm', ['use'], {
		cwd,
		stdio: 'inherit',
		env: process.env
	})

	const cmd = childProcess.spawnSync('yarn', ['install'], {
		cwd,
		stdio: 'inherit',
		env: process.env
	})

	return cmd.status === 0
}

async function writeEnv(installPath) {
	const from = path.resolve(installPath, `.env.example`)
	const to = path.resolve(installPath, `.env`)
	if (!fileExists(to)) {
		await copyFile(from, to)
		return true
	} else {
		return false
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
				return resolve(false)
			} else {
				resolve(true)
			}
		})
	})
}
