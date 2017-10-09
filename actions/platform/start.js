const chalk = require('chalk')
const { spawnSync } = require('child_process')
const { isProjectInstalled } = require('../../utils/dir')

module.exports = function start(installPath = process.cwd(), options) {
	if (!isProjectInstalled(installPath)) throw new Error('Halting...')

	const cmd = spawnSync('yarn', ['run', 'start'], {
		cwd: process.cwd(),
		stdio: 'inherit'
	})

	if (cmd.status !== 0) {
		console.error(cmd.error)
		console.error(
			chalk.bold.red('SCREEEETCH. Looks like something went wrong.')
		)
	} else {
		console.log(chalk.green("VROOOOOOOOMMM. I think it's working! 🌲🤖"))
	}
}
