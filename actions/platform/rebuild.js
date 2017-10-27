const { spawnSync } = require('child_process')
const chalk = require('chalk')

module.exports = function remove(path, options) {
	throw new Error('Not built yet!')
	spawnSync('docker-compose', ['down'])
	spawnSync('docker-compose', ['build'])

	console.log(chalk.green('Everything is built and ready! 💪'))
	console.log(chalk.yellow('Run `sprucebot platform start`  🌲 🤖'))
}
