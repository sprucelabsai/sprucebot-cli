const { spawnSync } = require('child_process')
const chalk = require('chalk')
const config = require('config')
const { isProjectInstalled } = require('../../utils/dir')

module.exports = function remove(platform = 'all', options) {
	if (!isProjectInstalled(process.cwd()))
		throw new Error('No install detected...')

	console.log('Shutting down...')
	let args = ['stop']
	if (platform === 'all') {
		args.push(platform)
	} else {
		try {
			const name = config.get(`platforms.${platform}.pm2.name`)
			args.push(name)
		} catch (err) {
			console.log(
				chalk.bold.red(`I could not shut down "${platform}"! Try web or api.`)
			)
			return
		}
	}

	const cmd = spawnSync('./node_modules/.bin/pm2', args, {
		cwd: process.cwd()
	})

	console.log(
		chalk.bold.green(
			platform === 'all'
				? `Cool, everything is shut down! 🛌`
				: `Alrighty, ${platform} is shutdown. 😴`
		)
	)
}
