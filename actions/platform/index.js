#!/usr/bin/env node
const { Command } = require('commander')

const platformInstall = require('./install')
const platformConfigure = require('./configure')
const platformLogs = require('./logs')
const platformStart = require('./start')
const platformStop = require('./stop')
const platformBuild = require('./rebuild')
const platformRestart = require('./restart')
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

	program.command('configure').action(catchActionErrors(platformConfigure))

	program
		.command('install [path]')
		.option('-p --platform [platform]', 'all|web|api|relay')
		.option('-u --username [gitUser]', 'Your github username')
		.option(
			'-b --branch [branch]',
			'The banch you wanna checkout, default to dev.'
		)
		.option(
			'-s --select-version',
			'Wanna select a version? Cool, add --select-version flag'
		)
		.action(catchActionErrors(platformInstall))

	program
		.command('version [platform]')
		.action(catchActionErrors(platformVersion))
	program.command('start').action(catchActionErrors(platformStart))
	program.command('stop [platform]').action(catchActionErrors(platformStop))
	program
		.command('logs [platform]')
		.option('-l --lines [lines]', 'How many lines', 1000)
		.action(catchActionErrors(platformLogs))
	// program.command('rebuild').action(catchActionErrors(platformBuild))
	// program.command('remove').action(catchActionErrors(platformRemove))
	program
		.command('restart [platform]')
		.action(catchActionErrors(platformRestart))

	program
		.command('owner:create [cellphone]')
		.action(catchActionErrors(platformOwnerCreate))

	program.parse(argv)

	return program
}

module.exports = argv => setup(argv)
