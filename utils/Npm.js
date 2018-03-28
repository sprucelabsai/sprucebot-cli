const execa = require('execa')
const path = require('path')
const config = require('config')
const request = require('request')
const tar = require('tar-fs')
const gunzip = require('gunzip-maybe')
const debug = require('debug')('sprucebot-cli')
const log = require('./log')

module.exports = {
	extractPackage,
	pkgVersions
}

async function extractPackage(pkg, version, to) {
	if (version === 'latest') {
		const cmd = await execa('npm', ['view', pkg, 'version'])
		version = cmd.stdout
		log.line(`Determined the latest ${pkg} version is ${version}`)
	}
	const pkgUrl = `${config.get('registry')}${pkg}/-/${pkg}-${version}.tgz`
	debug(pkgUrl)
	// Wait for package to download and unpack into `to` directory
	await new Promise((resolve, reject) => {
		request
			.get(pkgUrl)
			.on('response', res => {
				res.statusCode !== 200 && reject(res)
			})
			.on('error', res => reject(res))
			.pipe(gunzip())
			.pipe(
				tar.extract(to, {
					finish: resolve,
					map: header => {
						// Replace leading `/package/` folder
						header.name = header.name.replace(/^package\//, '')
						return header
					},
					filter: header => {
						// Remove the base package folder from being created
						return path.join(to, 'package') === header
					}
				})
			)
	})

	return true
}

async function pkgVersions(pkg) {
	const cmd = await execa('npm', ['view', pkg, 'versions'], {
		env: process.env
	})

	if (cmd.code !== 0) {
		
			console.error(chalk.yellow(cmd.stderr))
		throw new Error(
			cmd.stderr || 'Unknown spawn error'
		)
	}

	// string containt brackets "[ '1.0.0', '1.0.1' ]"
	const output = cmd.stdout || '[]'
	return JSON.parse(output.replace(/'/g, '"')) // Remove leading and trailing brackets from string and transform to array
}