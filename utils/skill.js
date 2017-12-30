const fs = require('fs')

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
	const newContents = contents.replace(
		new RegExp(`${key}=(.*)`),
		`${key}=${value}`
	)

	fs.writeFileSync(env, newContents)
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
