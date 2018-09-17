const execa = require('execa')
const path = require('path')
const config = require('config')
const request = require('request')
const tar = require('tar-fs')
const gunzip = require('gunzip-maybe')
const inquirer = require('inquirer')
const _ = require('lodash')
const debug = require('debug')('sprucebot-cli')
const log = require('./log')

module.exports = {
	extractPackage,
	pkgVersions,
	tagVersions,
	getLatestVersion,
	getChoices
}

async function getLatestVersion(pkg) {
	const cmd = await execa('npm', ['view', pkg, 'version'])
	return cmd.stdout
}

async function extractPackage(pkg, version, to = proces.cwd()) {
	if (version === 'latest') {
		version = await getLatestVersion(pkg)
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
	const cmd = await execa('npm', ['view', pkg, 'versions', '--json'], {
		env: process.env
	})

	if (cmd.code !== 0) {
		console.error(chalk.yellow(cmd.stderr))
		throw new Error(cmd.stderr || 'Unknown spawn error')
	}

	// string containt brackets "[ '1.0.0', '1.0.1' ]"
	const output = cmd.stdout || '[]'
	return JSON.parse(output)
}

async function tagVersions(pkg) {
	const cmd = await execa('npm', ['dist-tag', 'ls', pkg], {
		env: process.env
	})

	if (cmd.code !== 0) {
		console.error(chalk.yellow(cmd.stderr))
		throw new Error(cmd.stderr || 'Unknown spawn error')
	}
	const tags = {}
	const output = cmd.stdout
	const lines = output.split('\n')
	lines.forEach(line => {
		const matches = line.match(/(\w+):\s?([^\n]+)/)
		if (matches && matches[1] && matches[2]) {
			tags[matches[1]] = matches[2]
		}
	})

	return tags
}

function getChoices({ versions, tags }) {
	let choices = Object.keys(tags).map(k => `${k} (${tags[k]})`)
	choices.sort((a, b) => {
		if (/^latest/.test(a)) {
			return -1
		} else if (/^latest/.test(b)) {
			return 1
		}

		return 0
	})
	let versionChoices = versions.reverse().slice(0, 10)
	const taggedVersions = Object.values(tags)
	versionChoices = versionChoices.filter(v => !_.includes(taggedVersions, v))
	choices.push('<Enter Version>')
	choices.push(new inquirer.Separator())
	return choices.concat(versionChoices)
}
