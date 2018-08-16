#!/usr/bin/env node
const { Command } = require('commander')
const chalk = require('chalk')
const configUtil = require('../../utils/config')
const skillUtil = require('../../utils/skill')
const start = require('./start')
const assert = require('assert')

const requireSkill = action => {
	async function wrapper(...args) {
		try {
			// require skill
			requireSkill &&
				assert(
					skillUtil.isSkill(),
					'You are not in a skill! cd to a skill and try again.'
				)

			// make sure logged in
			requireSkill &&
				assert(
					configUtil.user(),
					'You must be logged in! Try `sprucebot user login`'
				)

			requireSkill &&
				assert(
					skillUtil.readEnv('ID'),
					'You must have registered your skill to run this command. Try `sprucebot skill register`'
				)

			await action(...args)
		} catch (err) {
			console.log(chalk.bold.red(err.message))
			console.error(err.stack)
		}
	}
	return wrapper
}

function setup(argv) {
	const program = new Command()

	program
		.command('start')
		.description('Start the Sprucebot simulator')
		.action(requireSkill(start))

	program.parse(argv)

	return program
}

module.exports = argv => setup(argv)
