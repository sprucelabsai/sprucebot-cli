const config = require('config')
const configUtil = require('../../utils/config')
const skillUtil = require('../../utils/skill')
const inquirer = require('inquirer')
const chalk = require('chalk')
const log = require('../../utils/log')
const fs = require('fs')
const path = require('path')
const sleep = require('sleep')

module.exports = async (_remote, command) => {
	let remote = _remote || false
	const remotes = config.get('skillRemotes')
	const currentRemote = configUtil.remote()
	const storyMode = !remote && !configUtil.user() && !currentRemote

	if (storyMode) {
		// intro
		log.image('disk')
		sleep.sleep(1)
		log.instructionsHeading('\n\nChapter 2: "Choosing a Remote"')
		sleep.sleep(1)
		log.instructions(
			"Our journey continues, slightly derailed, but we are ready for the challenge. After all, I'VE TRAINED MY WHOLE LIFE FOR THIS! 💪🏼💪🏼💪🏼"
		)
		await log.enterToContinue()
		log.instructions(
			"Now we have to point to a remote source. This is where you'll be connecting to use your skill. If you setup your own Sprucebot, you should select `platform.spruce.ai`."
		)
		log.instructions(
			"So check this out: You can access early and un-released features by selecting other environments. BUT, they may break at any time, you won't have access to any locations, and won't have permission to create a skill 😎."
		)
		log.instructions(
			'To request access, you can email `scientists@sprucelabs.ai`. No promises, though 🤞🏼.'
		)
		log.hint('Probably best to use "hello.spruce.ai" for now.')
	}

	if (!remote) {
		let defaultIdx = -1
		remotes.forEach((remote, idx) => {
			if (currentRemote && remote.url === currentRemote.url) {
				defaultIdx = idx
			}
		})
		const remoteAnswer = await inquirer.prompt({
			type: 'list',
			choices: remotes.map(remote => {
				return {
					name: remote.label,
					value: remote
				}
			}),
			name: 'remote',
			message: 'Select a remote.',
			default: defaultIdx
		})

		remote = remoteAnswer.remote.name
	}

	// pull the env out of config using command.name()
	const selectedRemote = remotes
		.filter(env => {
			return env.name === remote
		})
		.pop()

	// no env in config, bail
	if (!selectedRemote) {
		log.error('Invalid environment!')
		return
	}
	// save the remote for this dir
	configUtil.setRemote(selectedRemote)

	// update the skill's .env to reflect this
	skillUtil.writeEnv('API_HOST', selectedRemote.url)
	skillUtil.writeEnv(
		'API_SSL_ALLOW_SELF_SIGNED',
		selectedRemote.allowSelfSignedCerts ? 'true' : 'false'
	)

	log.success(`Environment set to ${selectedRemote.name}!`)
	if (storyMode) {
		log.instructions(
			'Sweeeet! All done. Now, if I remember correctly, we were supposed to be logging in, yeah?'
		)
		sleep.sleep(1)
	}
	log.hint('Login with: `sprucebot user login`')
}
