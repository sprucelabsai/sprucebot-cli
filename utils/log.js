const wrap = require('wrap-ansi')
const chalk = require('chalk')
const sleep = require('sleep')
const inquirer = require('inquirer')
const fs = require('fs')
const path = require('path')

module.exports = {
	_wrap(str) {
		return wrap(str, 59)
	},
	heading(str) {
		console.log(chalk.bold(this._wrap(str + '\n\n')))
	},
	instructions(str) {
		console.log(chalk.yellow(this._wrap(str + '\n\n')))
	},
	instructionsHeading(str) {
		console.log(chalk.bold.yellow(this._wrap(str + '\n\n')))
	},
	image(name) {
		const image = fs
			.readFileSync(path.join(__dirname, '../', 'images', `${name}.txt`))
			.toString()

		console.log(chalk.green.bold(image))
	},
	link(str) {
		console.log(chalk.bold.underline(this._wrap(str + '\n\n')))
	},
	hint(str) {
		console.log(chalk.bold.yellow(str + '\n\n'))
	},
	line(str) {
		console.log(this._wrap(str))
	},
	success(str) {
		console.log(chalk.green(this._wrap(str)))
	},
	error(str) {
		console.log(chalk.bold.red(this._wrap(str)))
	},
	async enterToContinue(msg) {
		await inquirer.prompt({
			type: 'input',
			name: 'confirm',
			message: chalk.yellow(msg || 'enter to continue...')
		})
		console.log('\n')
		console.log(chalk.yellow('🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲'))
		console.log('\n')
		sleep.msleep(1500)
	}
}
