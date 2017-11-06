const chalk = require('chalk')
const path = require('path')
const fs = require('fs')
const config = require('config')
const { spawnSync } = require('child_process')
const { isProjectInstalled } = require('../../utils/dir')

module.exports = function start(platform = 'all', options) {
	const installPath = process.cwd()

	//look at how restart is done. can this be made easier?
	if (!isProjectInstalled(installPath)) {
		const packagePath = path.join(installPath, 'package.json')
		if (!fs.existsSync(packagePath)) {
			console.log(chalk.bold.red('There is nothing for me to start here.'))
			return
		}
		const pkg = require(packagePath)
		const key = pkg.name.split('-').pop()
		platform = key
		const name = config.get(`platforms.${key}.pm2.name`)
		spawnSync('pm2', ['start', name, '--', 'run', 'local'], {
			cwd: process.cwd()
			// stdio: 'inherit'
		})
		return
	}

	let cmd
	if (platform === 'all') {
		console.log('Starting entire Sprucebot platform... one moment.')
		cmd = spawnSync('yarn', ['run', 'start'], {
			cwd: process.cwd()
			// stdio: 'inherit'
		})
	} else {
		console.log(`Starting Sprucebot ${platform}... one moment.`)
		// fully installed, but only starting one
		const name = config.get(`platforms.${platform}.pm2.name`)
		cmd = spawnSync('./node_modules/.bin/pm2', ['start', name], {
			cwd: process.cwd()
		})
	}

	if (cmd.status !== 0) {
		if (cmd.error) {
			console.error(cmd.error)
		}
		console.error(
			chalk.bold.red('SCREEEETCH. Looks like something went wrong.')
		)
		if (platform !== 'all') {
			console.log(
				chalk.yellow('Try `sprucebot platform start` to see if that works.')
			)
		}
	} else {
		console.log(
			chalk.green('VROOOOOOOOMMM. Platform boot sequence started! 🌲 🤖')
		)

		console.log(
			chalk.yellow(
				'Hint: Run `sprucebot platform logs' +
					(platform === 'all' ? '' : ` ${platform}`) +
					'` to check progress.'
			)
		)

		// TODO actually check endpoint to see if it has loaded
	}
}
