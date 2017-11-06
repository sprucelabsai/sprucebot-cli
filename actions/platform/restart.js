const { spawnSync } = require('child_process')
const chalk = require('chalk')
const config = require('config')
const { isProjectInstalled } = require('../../utils/dir')

module.exports = function remove(platform = 'all', options) {
	if (!isProjectInstalled(process.cwd()))
		throw new Error('No install detected...')

	console.log(`Restarting ${platform}...`)

	let args = ['restart']
	let msg = 'Platform restarted. It may take a minute for everything to boot.'
	if (platform === 'all') {
		args.push(platform)
	} else {
		try {
			const name = config.get(`platforms.${platform}.pm2.name`)
			args.push(name)
			msg = `${platform} restarted. Give it a sec to fully boot.`
		} catch (err) {
			console.log(
				chalk.bold.red(`I could not restart "${platform}"! Try web or api.`)
			)
			return
		}
	}

	const cmd = spawnSync('./node_modules/.bin/pm2', args, {
		cwd: process.cwd()
	})

	console.log(chalk.green(msg))

	console.log(
		chalk.yellow(
			'Hint: Run `sprucebot platform logs' +
				(platform === 'all' ? '' : ` ${platform}`) +
				'` to check progress.'
		)
	)

	//lets restart dev services for them
	// for some reason this is not working
	if (false && platform === 'api') {
		const cmd = spawnSync(
			'./node_modules/.bin/pm2',
			['restart', config.get(`platforms.dev.pm2.name`)],
			{
				cwd: process.cwd()
			}
		)
	}
}
