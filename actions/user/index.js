#!/usr/bin/env node
const { Command } = require('commander')
const login = require('./login')

const catchActionErrors = action => {
	async function wrapper(...args) {
		try {
			await action(...args)
		} catch (e) {
			console.error(e.stack)
			process.exitCode = 1
		}
	}
	return wrapper
}

function setup(argv) {
	const program = new Command()

	program
		.command('login [cell]')
		.description('Login as a Sprucebot developer. 🤓')
		.option('-p --pin [pin]', '4 digit pin')
		.action(catchActionErrors(login))

	program.parse(argv)

	return program
}

module.exports = argv => setup(argv)
