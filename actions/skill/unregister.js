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

module.exports = async function(commander) {
	const user = configUtil.user()
	const location = configUtil.location()
	const id = skillUtil.readEnv('ID')
	const apiKey = skillUtil.readEnv('API_KEY')
	let name = typeof commander.name !== 'function' ? commander.name : false
	const storyMode = !id && !name
	const remote = configUtil.remote()

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
		console.log('registerResponse', registerResponse)
		// set env variables
		skillUtil.writeEnv('ID', registerResponse.id)
		skillUtil.writeEnv('SLUG', registerResponse.slug)
		skillUtil.writeEnv('API_KEY', registerResponse.apiKey)
	} catch (err) {
		log.error("Well that didn't go as I expected 🚨")
		log.error(err.message)
		return
	}
}
