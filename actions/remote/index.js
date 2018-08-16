#!/usr/bin/env node
const { Command } = require('commander')
const set = require('./set')

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
		.command('set [remote]')
		.description('Sets remote.')
		.action(catchActionErrors(set))

	program.parse(argv)

	return program
}

module.exports = argv => setup(argv)
