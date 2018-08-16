#!/usr/bin/env node
const skillUtil = require('../utils/skill')
const chalk = require('chalk')
const assert = require('assert')

try {
	assert(
		skillUtil.isSkill(process.cwd()),
		'Not in a skill! cd to a skill to setup remote environments.'
	)
	const platform = require('../actions/remote')
	module.exports = platform(process.argv)
} catch (err) {
	console.log(chalk.bold.red(err.message))
}
