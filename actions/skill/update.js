const debug = require('debug')('sprucebot-cli')
const os = require('os')
const fs = require('fs-extra')
const path = require('path')
const config = require('config')
const chalk = require('chalk')
const execa = require('execa')
const inquirer = require('inquirer')
const skillUtil = require('../../utils/skill')
const log = require('../../utils/log')
const Git = require('../../utils/Git')
const semver = require('semver')
const {
	pkgVersions,
	tagVersions,
	getLatestVersion,
	extractPackage,
	getChoices
} = require('../../utils/Npm')

const PKG_NAME = config.get('skillKitPackage')
const TEMP = path.join(os.tmpdir(), new Date().getTime().toString())

module.exports = async function update(commander) {
	if (!skillUtil.isSkill()) {
		log.error(
			chalk.bold.red(
				'You are not in a skill. Try `sprucebot skill create` first 😂'
			)
		)
		return
	}

	try {
		if (!Git.isWorkingClean(process.cwd())) {
			log.error('Your working directory must be clean to update')
			log.hint('Try `git stash save` or `git commit`')
			return 1
		}

		const skillPkg = skillUtil.getPkg()
		const tags = await tagVersions(PKG_NAME)
		const versions = await pkgVersions(PKG_NAME)

		let OLD_PKG_NAME

		const previousVersion = skillPkg['sprucebot-skills-kit-version'] || '6.5.0'

		if (semver.gt(previousVersion, '6.40.0')) {
			OLD_PKG_NAME = '@sprucelabs/sprucebot-skills-kit'
		} else {
			OLD_PKG_NAME = 'sprucebot-skills-kit'
		}

		let fromPkg

		debug(`Using temp directory: ${TEMP}`)
		debug(`Checking for old version: ${skillPkg.version}`)

		if (versions.indexOf(skillPkg['sprucebot-skills-kit-version']) !== -1) {
			debug('From: new package name')
			fromPkg = PKG_NAME
		} else {
			debug('From: old package name')
			fromPkg = OLD_PKG_NAME
		}

		let version = commander.pkg
		if (!version) {
			const versionAnswer = await inquirer.prompt({
				type: 'list',
				name: 'version',
				message: `Select the version to use`,
				choices: getChoices({ versions, tags })
			})

			if (versionAnswer.version === '<Enter Version>') {
				const manualVersionAnswer = await inquirer.prompt({
					type: 'input',
					name: 'version',
					message: `Enter the version to use`
				})

				version = manualVersionAnswer.version
			} else if (/\s/.test(versionAnswer.version)) {
				const matches = versionAnswer.version.match(/\(([^\)]+)\)/)
				if (matches && matches[1]) {
					version = matches[1]
				} else {
					throw new Error('Unable to parse version')
				}
			} else {
				version = versionAnswer.version
			}
		}

		log.hint(
			`Updating ${
				skillPkg.name
			} sprucebot-skills-kit version from ${previousVersion} to ${version} 👀`
		)

		const confirmAnswer = await inquirer.prompt({
			type: 'confirm',
			name: 'confirm',
			message: 'Are you sure you want to update?',
			default: false
		})

		if (!confirmAnswer.confirm) {
			// Bail due to user input!
			return 1
		}

		await setup()

		debug(
			`Attempting to clone old version ${fromPkg} | ${
				skillPkg['sprucebot-skills-kit-version']
			} | ${TEMP}`
		)

		// Remove .rej files
		await execa.shell("find . -type f -name '*.rej' -delete")

		await extractPackage(fromPkg, previousVersion, process.cwd())

		await execa.shell('git add .')
		await execa.shell('git commit -m "Old Version" --no-verify --allow-empty')

		debug(`Attempting to clone new version to ${version} ${TEMP}`)
		await extractPackage(PKG_NAME, version, process.cwd())

		await execa.shell('git add .')
		await execa.shell('git commit -m "Newer Version" --no-verify')

		const patchPath = path.join(TEMP, 'changes.patch')
		await execa
			.shell(
				"git diff --binary --no-color HEAD~1 HEAD -- . ':(exclude)CHANGELOG.md'"
			)
			.stdout.pipe(fs.createWriteStream(patchPath))

		await execa.shell('git reset --hard HEAD~2')

		// TODO: Determine if we ever want to bring back 3-way merge capabilities
		// const strategyAnswer = await inquirer.prompt({
		// 	type: 'list',
		// 	name: 'mergeType',
		// 	message: `Select the merge (git apply --<your choice>) strategy (3way recommended).`,
		// 	choices: ['3way', 'reject']
		// })

		// Only allow reject
		const strategyAnswer = { mergeType: 'reject' }

		try {
			await execa.shell(
				`git apply ${
					strategyAnswer.mergeType === 'reject' ? '--reject' : '--3way'
				} ${patchPath} > /dev/null 2>&1`
			)
		} catch (cmd) {
			log.line(cmd.stderr)
			log.error(
				'Successfully applied the patch, but there may be conflicts to resolve 🤔'
			)
		} finally {
			log.success('Finished updating the skill')
			log.hint('To see what changed, use `git status`')
			log.hint('After resolving any conflicts run `yarn install && yarn test`')
			if (strategyAnswer.mergeType === 'reject') {
				const result = await execa.shell("find . -type f -name '*.rej'")
				log.hint(
					`Automatic merge could not be performed on the following files. Please manually apply changes:\n${
						result.stdout
					}`
				)
			}
		}

		// Update the skills kit version
		const packageJsonFile = `${process.cwd()}/package.json`
		fs.readFile(packageJsonFile, 'utf8', function(err, data) {
			if (err) {
				return console.log(err)
			}
			// Check if sprucebot-skills-kit-version exists in the package.json
			let result = data
			if (/\"sprucebot-skills-kit-version\"/.test(data)) {
				result = data.replace(
					/\"sprucebot-skills-kit-version\": \".*\"/g,
					`"sprucebot-skills-kit-version": "${version}"`
				)

				fs.writeFile(packageJsonFile, result, 'utf8', err => {
					if (err) {
						log.error("I wasn't able to set the package.json version.")
					}
				})
			} else {
				// Create the entry below the "version" tag
				result = data.replace(
					/(\"version\": \".*\",)\n/g,
					`$1\n  "sprucebot-skills-kit-version": "${version}",\n`
				)
			}
			fs.writeFile(packageJsonFile, result, 'utf8', err => {
				if (err) {
					log.error("I wasn't able to set the package.json version.")
				}
			})
		})
	} catch (err) {
		log.error('Error while running update')
		console.error(err)
	} finally {
		cleanup()
	}

	return 0
}

async function setup() {
	fs.removeSync(TEMP)
	fs.mkdirpSync(TEMP)

	process.env.GIT_DIR = path.resolve(TEMP, '.git')
	process.env.GIT_WORK_TREE = '.'

	await execa.shell('git init')

	try {
		const ignoreContents = fs.readFileSync('.gitignore', 'utf8')
		fs.appendFileSync(
			path.resolve(TEMP, process.env.GIT_DIR, 'info/exclude'),
			ignoreContents
		)
	} catch (e) {
		debug("Couldn't find a .gitignore file to append")
	}

	await execa.shell('git add .')

	await execa.shell('git commit -m "Init Checkpoint" --no-verify')
}

function cleanup() {}
