#!/usr/bin/env node
const skillUtil = require('../utils/skill')
const log = require('../utils/log')
const chalk = require('chalk')
const configUtil = require('../utils/config')
const assert = require('assert')
const sleep = require('sleep')

try {
	assert(
		skillUtil.isSkill(process.cwd()),
		'This is not a skill! cd to a skill to run user commands.'
	)

	if (!configUtil.remote(process.cwd())) {
		log.image('whoami')
		sleep.sleep(1)
		log.error('🚨 WARNING. REMOTE NOT SET 🚨\n\n')
		sleep.sleep(1)
		log.instructions(
			'Ok, ok, play it cool Sprucebot, you know what to do here.'
		)
		log.enterToContinue().then(() => {
			log.instructions(
				'Alright, so, according to the manual, you gotta decide which remote we want to log into.'
			)
			log.instructions('I should have known that 🤦‍♂️.')
			log.hint('Try `sprucebot remote set`')
		})
	} else {
		const platform = require('../actions/user')
		module.exports = platform(process.argv)
	}
} catch (err) {
	console.log(chalk.bold.red(err.message))
}
