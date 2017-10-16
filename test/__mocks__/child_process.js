const fs = require('fs-extra')
const path = require('path')

function spawnSync(cmd, argv, { cwd = process.cwd() }) {
	switch (cmd) {
		case 'git':
			const [subCMD, remote, cpyPath] = argv
			switch (subCMD) {
				case 'clone':
					const repoParts = remote.split('/')
					const repo = repoParts[repoParts.length - 1]
					const frmPath = path.join(__dirname, `repos/${repo}`)
					fs.copySync(frmPath, cpyPath)
					return { status: 0, error: null }
				default:
					const error = `Missing git subcommand handler ${cmd} ${subCMD}`
					return {
						status: 1,
						error: new Error(error),
						stderr: error
					}
			}
		case 'sh':
		case 'yarn':
			break
		default:
			const error = `Missing git subcommand handler ${cmd}`
			return {
				status: 1,
				error: new Error(error),
				stderr: error
			}
	}
	return { status: 0, error: null, stderr: '' }
}

module.exports = {
	spawnSync: jest.fn(spawnSync)
}
