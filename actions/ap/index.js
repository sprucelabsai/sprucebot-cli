#!/usr/bin/env node
const { Command } = require('commander')

const start = require('./start')

function setup(argv) {
	const program = new Command()

	program
		.command('start')
		.description('Start the access point simulator')
		.action(start)

	program.parse(argv)

	return program
}

module.exports = argv => setup(argv)
