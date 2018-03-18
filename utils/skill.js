const fs = require('fs')
const os = require('os')

exports.isSkill = (cwd = process.cwd()) => {
	try {
		const pkg = require(`${cwd}/package.json`)
		if (
			!pkg ||
			!pkg.dependencies ||
			!pkg.dependencies['sprucebot-skills-kit-server']
		) {
			return false
		}
		return true
	} catch (err) {
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
