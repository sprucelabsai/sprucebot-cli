#!/usr/bin/env node
const chalk = require('chalk')
const localtunnel = require('localtunnel')

try {
	const port = process.argv[2]
	const options = { host: 'https://kn.ly' }
	var tunnel = localtunnel(port, options, (err, tunnel) => {
		if (err) {
			console.log(err)
			process.exit(1)
		}

		// the assigned public url for your tunnel
		// i.e. https://abcdefgjhij.localtunnel.me
		// console.log('connected')
		// console.log({ tunnel })
		console.log(chalk.bold.green(`Port ${port} exposed at: ${tunnel.url}`))
	})

	tunnel.on('request', function(info) {
		// console.log('REQUEST', { info })
		console.log(chalk.green(`[${info.method}] ${info.path}`))
	})
	tunnel.on('close', function() {
		// tunnels are closed
		process.exit(0)
	})
} catch (err) {
	console.log(chalk.bold.red(err.message))
}
