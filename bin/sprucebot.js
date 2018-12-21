#!/usr/bin/env node

/**
 * The `sprucebot` command line tool is used to initiate and run SpruceBot applications
 * @example
 * # sprucebot -v
 * # sprucebot -h
 * # sprucebot npmStart [args...]
 */
const { Command } = require('commander')
const path = require('path')
// Override the NODE_CONFIG DIR if not set
// This allows us to use the cli from any directory
process.env.NODE_CONFIG_DIR =
	process.env.NODE_CONFIG_DIR || path.join(__dirname, '../config')
const { version, description } = require('config')

function setup(argv) {
	const program = new Command()

	// Hack to allow alias of "sb" because commander doesn't seem to support it w/ git style commands
	argv[1] = argv[1].replace(/sb$/, 'sprucebot')

	/**
	 * General tool options and usage help
	 */
	program
		.version(version)
		.description(description)
		// Commands are registered without .action callback. This tells `commander`
		// that we use separate executables in ./bin/ for sub-commands
		// registering `platform` will execute `./bin/sprucebot-platform.js`
		.command(
			'remote [options]',
			'Set your remote environment (dev|qa|alpha|prod|etc)'
		)
		.command('skill [options]', 'Build skills')
		.command('simulator [options]', 'Simulate Sprucebot locally')
		.command('user [options]', 'Login to begin skill development')
		.command('platform [options]', 'Setup and deploy the Sprucebot platform')
		.command('expose <PORT>', 'Expose local port. Example: sb expose 3005')

	program.parse(argv)
}

module.exports = setup(process.argv)
