const inquirer = require('inquirer')
const skillUtil = require('../../utils/skill')
const chalk = require('chalk')
const config = require('config')
const path = require('path')
const childProcess = require('child_process')
const fs = require('fs-extra')
const tar = require('tar-fs')
const gunzip = require('gunzip-maybe')
const sleep = require('sleep')
const log = require('../../utils/log')
const debug = require('debug')('sprucebot-cli')
const { extractPackage, pkgVersions } = require('../../utils/Npm')


module.exports = async function create(commander) {
	// make sure we're not already in a skill
	if (skillUtil.isSkill()) {
		console.log(
			chalk.bold.red(
				`You are already in a skill. You can't create a skill in a skill.... yet 🤷🏼‍♂️`
			)
		)
		return
	}
	const prompts = []

	// collect name
	let name = (typeof commander.name === 'string' && commander.name) || false
	let storyMode = !name

	if (storyMode) {
		// logo
		log.image('logo')

		sleep.sleep(1)
		log.instructionsHeading(`\n\Chapter 1: "Creating a Skill"! 🍺🍕`)
		log.instructions(
			`I'm Sprucebot 🌲🤖 and together we're going to change brick-and-mortar forever! I'm super jazzed to get started 🙌🏼. But first, it would def be a good idea to read my docs on githhub.`
		)
		log.link(
			'https://github.com/sprucelabsai/sprucebot-skills-kit/tree/dev/docs'
		)
		await log.enterToContinue()
		log.instructions(
			'Sweet! Lets do this! Before we venture into code 👾, we have to define some basic information about your skill.'
		)
		log.instructions("We'll start by giving your skill a name and a slug.")

		log.instructions(
			'Pick a good, hardy, memorable name. But, also make sure it reflects the nature of your skill. Oh, and make it fun! Examples are Vip Alerts 💥, Scratch & Win, Little Black Book 📓.'
		)

		log.instructions(
			"Slugs must be unique and can only contain [a-z] and hyphens. They are simplified versions of your name, like vip-alerts, scratch-and-win, little-black-book. Keep in mind these are global, so you'll want to prefix yours with something (liquidg3-my-first-skill)."
		)

		log.instructions('But, you read the docs, so you knew all that. 🙇‍♂️')

		log.instructions('Cool, you got this 👊🏼.')
		log.hint('Hint: Use an emoji. Humans love that sh** 🤘🏼.')

		const nameAnswer = await inquirer.prompt({
			type: 'input',
			name: 'name',
			message: 'Name your skill:',
			validate: val => val.length && val.length > 0
		})
		name = nameAnswer.name
	}

	let slug =
		commander.slug ||
		name
			.replace(/[\W_]+/g, ' ')
			.toLowerCase()
			.trim()
			.replace(/ /g, '-')

	if (!commander.slug) {
		const slugAnswer = await inquirer.prompt({
			type: 'input',
			name: 'slug',
			message: `You skill's slug, e.g. vip-alerts, scratch-and-win:`,
			default: slug,
			validate: val => val.length && val.length > 0
		})
		slug = slugAnswer.slug
	}

	let version = commander.pkg
	if (!version) {
		const versions = await pkgVersions(config.get('skillKitPackage'))
		const versionAnswer = await inquirer.prompt({
			type: 'list',
			name: 'version',
			message: `Select the version to use`,
			choices: ['latest'].concat(versions)
		})

		version = versionAnswer.version
	}

	// where we are saving to
	log.line('Downloading Skills Kit... ⌚️')
	const to = path.join(process.cwd(), slug)

	if (fs.existsSync(to)) {
		log.error('A skill already exists with this slug.')
		log.hint(
			'Try deleting `' +
				slug +
				'` and running `sprucebot skill create -n "' +
				name +
				'"`'
		)
		return
	}

	if (storyMode) {
		log.instructions(
			"\n\nHeck yeah! I'm gonna start downloading the Skills Kit, which will serve as the foundation for your own skill.\n\nYou ready?"
		)
		await log.enterToContinue()
		log.line('Downloading now!')
	}

	try {
		// extractPackage the repo
		await extractPackage(config.get('skillKitPackage'), version, to)
	} catch (e) {
		debug(e)
		log.error(
			"Crap, I couldn't download the kit. Are you connected to the net? If so, did a botnet of IoT cameras take down DNS again?"
		)
		log.hint(`Make sure the ${version} package exists in the npm registry`)
		return
	}

	log.success('Download complete!')

	// copy .env.example to .env and populate it
	log.line('Configuring...')
	const envOld = path.join(to, '.env.example')
	const envNew = path.join(to, '.env')

	try {
		fs.copySync(envOld, envNew)
	} catch (e) {
		log.hint(
			'Uh oh. There is no .env.example I can copy. Creating an empty .env'
		)
		log.hint('`sprucebot skill register` will help write your .env')
		fs.openSync(envNew, 'w')
	}

	// drop in name and slug
	skillUtil.writeEnv('NAME', name, envNew)
	skillUtil.writeEnv('SLUG', slug, envNew)

	log.line('Cleaning up...')
	//remove the git dir

	const gitDir = path.join(to, '.git')
	fs.removeSync(gitDir)
	log.success('Done 💥💥💥')

	if (storyMode) {
		sleep.sleep(1)
		log.instructionsHeading('\n\nChapter 1 complete!')
		log.instructions('This is so much fun! 🎉')
		log.instructions(
			"Our next quest is getting the skill running. ⚔️ 🛡   Once it's running, we can begin coding!"
		)
		log.instructions(
			"To get the skill running, you have to log in and register it with homebase. Don't sweat it, it's easy!"
		)
		log.hint(
			'To skip story mode in the future, run `sprucebot skill create -n "' +
				name +
				'"`'
		)
		log.hint(
			'Run the following to continue: `cd ' + slug + ' && sprucebot user login`'
		)
	} else {
		log.hint('Run: `cd ' + slug + ' && sprucebot user login`')
	}
}
