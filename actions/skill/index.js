#!/usr/bin/env node
const { Command } = require('commander')

const create = require('./create')
const register = require('./register')
const assert = require('assert')
const configUtil = require('../../utils/config')
const skillUtil = require('../../utils/skill')
const chalk = require('chalk')

const requireSkill = (requireSkill, action) => {
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
		.command('create')
		.description('Create a new skill')
		.option('-n --name [name]', 'Name of your skill')
		.option('-s --slug [name]', 'Slug of your skill')
		.action(requireSkill(false, create))

	program
		.command('register')
		.option('-n --name [name]', 'Name of your skill')
		.description('Register your skill so you can begin development')
		.action(requireSkill(true, register))

	program.parse(argv)

	return program
}

module.exports = argv => setup(argv)
