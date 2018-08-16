const path = require('path')
const fs = require('fs')
const mkdirp = require('mkdirp')
const jsonfile = require('jsonfile')

let config = null

exports._path = () => {
	return path.join(require('os').homedir(), '.sprucebot', 'config.json')
}

exports._get = () => {
	if (config) {
		return config
	}
	// build path to config
	const filePath = this._path()
	const folderPath = path.dirname(filePath)

	if (!fs.existsSync(folderPath)) {
		mkdirp.sync(folderPath)
	}

	// if it does not exist, create it
	if (!fs.existsSync(filePath)) {
		return {}
	}

	config = require(filePath)

	return config
}

exports._put = conf => {
	const filePath = this._path()
	jsonfile.writeFileSync(filePath, conf)
}

exports.setRemote = (remote, cwd = process.cwd()) => {
	const config = this._get()
	if (!config.skillEnvironments) {
		config.skillEnvironments = {}
	}

	if (!config.skillEnvironments[cwd]) {
		config.skillEnvironments[cwd] = {}
	}

	config.skillEnvironments[cwd].remote = remote

	this._put(config)
}

exports.remote = (cwd = process.cwd()) => {
	const config = this._get()
	if (
		!config.skillEnvironments ||
		!config.skillEnvironments[cwd] ||
		!config.skillEnvironments[cwd].remote
	) {
		return undefined
	}
	return config.skillEnvironments[cwd].remote
}

exports.saveUser = (user, cwd = process.cwd()) => {
	const config = this._get()
	config.skillEnvironments[cwd].user = user
	this._put(config)
}

exports.user = (cwd = process.cwd()) => {
	const config = this._get()
	return (
		config.skillEnvironments &&
		config.skillEnvironments[cwd] &&
		config.skillEnvironments[cwd].user
	)
}

exports.saveLocation = (location, cwd = process.cwd()) => {
	const config = this._get()
	config.skillEnvironments[cwd].location = location
	this._put(config)
}

exports.location = (cwd = process.cwd()) => {
	const config = this._get()
	return (
		config.skillEnvironments &&
		config.skillEnvironments[cwd] &&
		config.skillEnvironments[cwd].location
	)
}
