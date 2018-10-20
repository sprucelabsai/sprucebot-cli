const skillUtil = require('../../utils/skill')
const requestUtil = require('../../utils/request')
const configUtil = require('../../utils/config')
const config = require('config')
const inquirer = require('inquirer')
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const log = require('../../utils/log')
const sleep = require('sleep')
const opn = require('opn')

module.exports = async function(commander) {
	const user = configUtil.user()
	const location = configUtil.location()
	const id = skillUtil.readEnv('ID')
	const apiKey = skillUtil.readEnv('API_KEY')
	let name = typeof commander.name !== 'function' ? commander.name : false
	const storyMode = !id && !name
	const remote = configUtil.remote()
	const destinationSkill = `${remote.web}/bizprofile/${location.id}/skill/${id}`
	const destinationBizProfile = `${remote.web}/bizprofile/${location.id}`

	if (apiKey) {
		log.error('Skill already registered!')
		log.hint('Try `sprucebot skill update` or `sprucebot skill unregister`')
		return
	}

	if (storyMode) {
		log.image('thumbs-up')
		sleep.sleep(1)
		log.instructionsHeading(
			'\n\nChapter 4: "How many effing chapters are there?"'
		)
		log.instructions(`Seriously ${user.firstName}, I feel your pain!`)
		await log.enterToContinue()
		log.instructions(`Just kidding, I don't feel.`)
		await log.enterToContinue('...')
		log.instructions(
			`But, you can put those feels away, because it's the last step 🤓. But, I'm not gonna lie, it's a big one.`
		)

		log.instructions(
			`I'm gonna have you confirm a few things, grab a short description from you... then, we gotta talk about how you want to tunnel requests to your skill.😬`
		)

		log.instructions('But, lets start with the easy stuff.')

		log.hint(
			`Pro tip: Make your description short and sweet... and good, make it good. If you seek examples, visit ${destinationBizProfile} and checkout the "Skills Marketplace". 😅`
		)
	}
	// make sure requests are authed
	requestUtil.auth(user)

	const prompts = config.get('skillProps').map(prop => {
		return {
			name: prop.key,
			message: prop.name,
			validate: val => val.length && val.length > 0,
			default: (prop.key === 'NAME' && name) || skillUtil.readEnv(prop.key)
		}
	})

	const answers = await inquirer.prompt(prompts)
	let slugTaken = false

	log.line(`Checking ${answers.SLUG}...`)

	do {
		const slugResponse = await requestUtil.get(
			`/dev/${location.id}/skill/slug/${answers.SLUG}/available`
		)

		slugTaken = !slugResponse.available

		if (slugTaken) {
			const slugAnswer = await inquirer.prompt({
				name: 'slug',
				message: chalk.red(
					`The slug ${answers.SLUG} is taken, try a different one`
				),
				default: answers.SLUG
			})

			answers.SLUG = slugAnswer.slug
		}
	} while (slugTaken)

	if (storyMode) {
		log.instructions(
			"\n\nOk, lets talk about your tunnel situation. See, in order for me to reach your local skill, I will need a publicly accessible url or IP and it'll need to be secure (https)."
		)
	}

	const hasTunnelAnswer = await inquirer.prompt({
		type: 'confirm',
		name: 'hasTunnel',
		message: 'Do you have a tunnel ready to configure (e.g. https://ngrok.io)'
	})

	if (hasTunnelAnswer.hasTunnel) {
		let port = skillUtil.readEnv('PORT')
		if (!port) {
			port = skillUtil.writeEnv('PORT', 3006)
		}
		log.hint(
			'\n\nPoint your tunnel to `http://localhost:' +
				port +
				"`. I'll hang here while you do that."
		)
		await log.enterToContinue()

		log.hint(
			`Reminder: Don't forget to make sure your tunnel is secure (https)!`
		)

		let unsecureTunnel = false
		do {
			const tunnelAnswer = await inquirer.prompt({
				name: 'url',
				message: 'Tunnel url (https://my-skill.ngrok.io)',
				required: true
			})

			unsecureTunnel = !tunnelAnswer.url.toLowerCase().includes('https://')

			if (unsecureTunnel) {
				log.instructions(
					'Oops!  I think you forgot to make your tunnel secure.  Try again and make sure it has https!'
				)
			} else {
				skillUtil.writeEnv('SERVER_HOST', tunnelAnswer.url)
				skillUtil.writeEnv('INTERFACE_HOST', tunnelAnswer.url)
			}
		} while (unsecureTunnel)
	}

	log.instructions('Registering skill')

	try {
		const registerResponse = await requestUtil.post(
			`/dev/${location.id}/skill/register`,
			{
				name: answers.NAME,
				slug: answers.SLUG,
				description: answers.DESCRIPTION,
				icon: fs
					.readFileSync(path.join(process.cwd(), 'icon', 'icon.svg'))
					.toString()
			}
		)
		// set env variables
		skillUtil.writeEnv('NAME', registerResponse.name)
		skillUtil.writeEnv('ID', registerResponse.id)
		skillUtil.writeEnv('API_KEY', registerResponse.apiKey)
		skillUtil.writeEnv('SLUG', registerResponse.slug)
		skillUtil.writeEnv('DESCRIPTION', registerResponse.description)
		skillUtil.writeEnv('ICON', registerResponse.icon)
	} catch (err) {
		log.error("Well that didn't go as I expected 🚨")
		log.error(err.message)
		return
	}

	if (storyMode) {
		log.instructionsHeading('\n\nWe are done! 💥💥💥')
		log.instructions(
			"What an adventure! 🏆  If you check your .env, you'll see I populated ID & API_KEY. Using these two variables, you (or anyone else) can make updates to your skill. The ID is public, but your API_KEY is private and used to sign payloads between your skill and core.  So, going forward, you`ll make updates directly to your .env."
		)
		log.instructions(
			'I know, I know, you knew all that, because you read the docs.\n\n🙇‍♂️'
		)

		await log.enterToContinue()

		log.instructionsHeading('.env Review')
		log.instructions('Lets review your .env so you can get familiar with it.')

		await log.enterToContinue()

		opn(`${process.cwd()}/.env`)

		await log.enterToContinue()

		log.instructionsHeading('Starting your skill')
		log.hint(
			`Open a new terminal window and run ${'`cd ' +
				process.cwd() +
				' && yarn && yarn run local`'}`
		)

		await log.enterToContinue()

		log.instructionsHeading('Viewing your skill')
		log.instructions(`Once you're ready I'll take you to your skill!`)

		await log.enterToContinue()
		opn(destinationSkill)
		await log.enterToContinue()

		log.instructions('Woohoo! All done!')
		log.hint('You are def gonna wanna check this out:')
		log.link(
			'https://github.com/sprucelabsai/sprucebot-skills-kit/blob/dev/docs/simulator.md'
		)
		log.instructionsHeading('🌲🤖✌🏼')
	} else {
		log.instructions('Skill succesfully registered!')
		log.hint('Please run `yarn && yarn run local`')
	}
}
