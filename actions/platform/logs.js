const { spawnSync } = require('child_process')
const chalk = require('chalk')
const config = require('config')
const { isProjectInstalled } = require('../../utils/dir')

module.exports = function remove(platform = 'all', options) {
	if (!isProjectInstalled(process.cwd()))
		throw new Error('No install detected...')

	let args = ['logs']
	if (platform === 'all') {
		args.push(platform)
	} else {
		try {
			const name = config.get(`platforms.${platform}.pm2.name`)
			args.push(name)
		} catch (err) {
			console.log(
				chalk.bold.red(
					`I could not load logs for "${platform}"! Try web or api.`
				)
			)
			return
		}
	}

	args.push('--lines')
	args.push(options.lines)

	const cmd = spawnSync('./node_modules/.bin/pm2', args, {
		cwd: process.cwd(),
		stdio: 'inherit'
	})
}
