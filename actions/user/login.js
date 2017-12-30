const chalk = require('chalk')
const requestUtil = require('../../utils/request')
const configUtil = require('../../utils/config')
const log = require('../../utils/log')
const inquirer = require('inquirer')
const sleep = require('sleep')
const fs = require('fs')
const path = require('path')

module.exports = async function login(phone, command) {
	const prompts = []
	let pin = command.pin || false
	let cell = phone || false
	let storyMode = !cell && !configUtil.user()
	const remote = configUtil.remote()

	if (storyMode) {
		// heading
		log.image('whoami')
		sleep.sleep(1)
		log.instructionsHeading('\n\nChapter 3: "Who am I?"')
		log.instructions(
			"We are back on track and there isn't much further to go. Aaaaaah! Why is it taking so long to get to us?"
		)
		await log.enterToContinue()
		log.instructions(
			`You will need to login for each skill you are developing. Use the phone you setup at ${remote.label}.  Once you log in, you'll be able to generate the your skill's ID & API_KEY.`
		)

		log.instructions(
			"You must be the owner of a location in order to build a skill. If you aren't one, checkout our dev resources to get started."
		)

		log.link('https://dev.sprucebot.com')

		log.instructions(
			"Developer access is granted on a per-location basis. I'm assuming your location is your home or office and not an actual shop. But, either works, just be careful in live environments."
		)

		await log.enterToContinue()

		log.instructions('Lets do this!')
	}

	if (!cell) {
		const phoneAnswer = await inquirer.prompt({
			type: 'input',
			name: 'cell',
			message: 'What is your cell? 📱'
		})
		cell = phoneAnswer.cell
	}

	// generate pin
	if (!pin) {
		// send them the pin
		await requestUtil.post('/users/login', {
			phoneNumber: cell
		})

		// let them enter it
		const pinAnswer = await inquirer.prompt({
			type: 'input',
			name: 'pin',
			message: 'Enter the pin I just sent! 🤘'
		})

		pin = pinAnswer.pin
	}

	// get back user
	const user = await requestUtil.post('/users/confirmLogin', {
		phoneNumber: cell,
		confirmationCode: pin
	})

	log.success(`Identity confirmed... Welcome back ${user.firstName}!`)

	// get the users locations
	requestUtil.auth(user)
	const me = await requestUtil.get('/users/me')
	const locations = me.teams.filter(team => team.role === 'owner')
	let location

	if (locations.length === 0) {
		console.log(
			chalk.bold.red(
				'You need to be owner of at least one location to begin skills development. Visit https://dev.sprucebot.com to get your dev unit shipped today!'
			)
		)
	} else if (locations.length === 1) {
		location = locations[0].Location
	} else {
		log.line(
			`I see you are owner of ${locations.length ===
				1} location${locations.length === 1 ? '' : 's'}.`
		)

		const locationAnswer = await inquirer.prompt({
			type: 'list',
			name: 'location',
			message: 'At which location will you be developing?',
			choices: locations.map(location => {
				return { name: location.Location.name, value: location.Location }
			})
		})

		location = locationAnswer.location
	}

	await requestUtil.post(`/dev/${location.id}/register`)

	await configUtil.saveUser(user)
	await configUtil.saveLocation(location)

	log.success(`You are all setup to dev at ${location.name}.`)

	if (storyMode) {
		sleep.sleep(1)
		log.instructions(
			"\n\nLet's go over what just happened: Not only have you been authenticated, but you've been setup as a developer at " +
				location.name +
				'. 🤓'
		)

		log.instructions(
			`Next step is to register your skill so it's available when you visit ${remote.label}.`
		)
	}

	log.hint('Try running `sprucebot skill register`')
}
