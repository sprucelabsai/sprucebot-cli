#!/usr/bin/env node
const chalk = require('chalk')
const assert = require('assert')

try {
	const platform = require('../actions/skill')
	module.exports = platform(process.argv)
} catch (err) {
	console.log(chalk.bold.red(err.stack))
}
