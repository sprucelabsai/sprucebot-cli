#!/usr/bin/env node
const { Command } = require('commander')

const platformInit = require('./init')
const platformConfigure = require('./configure')
const platformStart = require('./start')
const platformBuild = require('./rebuild')
const platformRemove = require('./remove')
const platformVersion = require('./version')
const platformOwnerCreate = require('./ownerCreate')

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
		.command('configure [path]')
		.action(catchActionErrors(platformConfigure))

	program
		.command('init [path]')
		.option('--skip-install', 'Skip cloning repositories')
		.option(
			'-s --select-version',
			'Wanna select a version? Cool, add --select-version flag'
		)
		.action(catchActionErrors(platformInit))

	program.command('version [path]').action(catchActionErrors(platformVersion))

	program.command('start [path]').action(catchActionErrors(platformStart))

	program.command('rebuild [path]').action(catchActionErrors(platformBuild))

	program.command('remove [path]').action(catchActionErrors(platformRemove))

	program
		.command('owner:create [cellphone]')
		.action(catchActionErrors(platformOwnerCreate))

	program.parse(argv)

	return program
}

module.exports = argv => setup(argv)
