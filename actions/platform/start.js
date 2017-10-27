const chalk = require('chalk')
const path = require('path')
const config = require('config')
const { spawnSync } = require('child_process')
const { isProjectInstalled } = require('../../utils/dir')

module.exports = function start(options) {
	const installPath = process.cwd()

	//look at how restart is done. can this be made easier?
	if (!isProjectInstalled(installPath)) {
		const pkg = require(path.join(installPath, 'package.json'))
		const key = pkg.name.split('-').pop()
		const name = config.get(`platforms.${key}.pm2.name`)
		spawnSync('pm2', ['start', name, '--', 'run', 'local'], {
			cwd: process.cwd(),
			stdio: 'inherit'
		})
		return
	}

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
