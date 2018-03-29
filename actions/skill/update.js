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
const {
	pkgVersions,
	getLatestVersion,
	extractPackage
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
		const versions = await pkgVersions(PKG_NAME)
		if (versions.indexOf(skillPkg.version) === -1) {
			log.error(
				`${PKG_NAME}@${skillPkg.version} does not exist in the npm registry`
			)
			log.hint(
				`If this is your first time updating the skill, you are probably on a very old version. Change your declared version to 0.3.0, and then try updating again`
			)
			return 1
		}

		let version = commander.pkg
		if (!version) {
			const versionAnswer = await inquirer.prompt({
				type: 'list',
				name: 'version',
				message: `Select the version to use`,
				choices: ['latest'].concat(versions.reverse())
			})

			version = versionAnswer.version
		}

		if (version === 'latest') {
			version = await getLatestVersion(PKG_NAME)
		}

		log.hint(
			`Updating ${skillPkg.name}@${
				skillPkg.version
			} to ${PKG_NAME}@${version} 👀`
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

		debug(`Attempting to clone old version to ${skillPkg.version} ${TEMP}`)
		await extractPackage(PKG_NAME, skillPkg.version, process.cwd())

		await execa.shell('git add .')
		await execa.shell('git commit -m "Old Version" --no-verify --allow-empty')

		debug(`Attempting to clone new version to ${version} ${TEMP}`)
		await extractPackage(PKG_NAME, version, process.cwd())

		await execa.shell('git add .')
		await execa.shell('git commit -m "Newer Version" --no-verify')

		const patchPath = path.join(TEMP, 'changes.patch')
		await execa
			.shell('git diff --binary --no-color HEAD~1 HEAD')
			.stdout.pipe(fs.createWriteStream(patchPath))

		await execa.shell('git reset --hard HEAD~2')

		try {
			await execa.shell(`git apply --3way ${patchPath}`)
		} catch (cmd) {
			log.line(cmd.stderr)
			log.error(
				'Successfully applied the patch, but there may be conflicts to resolve 🤔'
			)
		} finally {
			log.success('Finished updating the skill')
			log.hint('To see what changed, use `git status`')
			log.hint('After resolving any conflicts run `yarn install && yarn test`')
		}
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
