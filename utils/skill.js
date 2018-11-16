const fs = require('fs')
const os = require('os')
const path = require('path')
const debug = require('debug')('sprucebot-cli')

exports.isSkill = (cwd = process.cwd()) => {
	try {
		const pkg = getPkg(cwd)
		if (
			!pkg ||
			!pkg.dependencies ||
			(!pkg.dependencies['@sprucelabs/spruce-skill-server'] &&
				!pkg.dependencies['@sprucelabs/sprucebot-skills-kit-server'] &&
				!pkg.dependencies['sprucebot-skills-kit-server'])
		) {
			return false
		}
		return true
	} catch (err) {
		debug(err)
		return false
	}
}

exports.writeEnv = (key, value, env = process.cwd() + '/.env') => {
	const contents = fs.readFileSync(env).toString()
	const target = new RegExp(`${key}=(.*)`)
	const newVal = `${key}=${value}`
	let newContents
	if (contents.match(target)) {
		newContents = contents.replace(target, newVal)
	} else {
		newContents = `${contents}${os.EOL}${newVal}`
	}

	fs.writeFileSync(env, newContents)
	return value
}

exports.readEnv = (key, env = process.cwd() + '/.env') => {
	const contents = fs.readFileSync(env).toString()
	const matches = contents.match(new RegExp(`${key}=(.*)`))
	if (matches) {
		return matches[1]
	} else {
		return undefined
	}
}

exports.skill = (env = process.cwd() + '/.env') => {
	return {
		id: this.readEnv('ID'),
		name: this.readEnv('NAME'),
		slug: this.readEnv('SLUG')
	}
}

function getPkg(dir = process.cwd()) {
	return require(path.join(dir, 'package.json'))
}

exports.getPkg = getPkg
