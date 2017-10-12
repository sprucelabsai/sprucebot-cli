const fs = require('fs-extra')
const path = require('path')

module.exports = {
	spawnSync: jest.fn((cmd, argv, { cwd = process.cwd() }) => {
		switch (cmd) {
			case 'git':
				const [subCMD, remote, cpyPath] = argv
				switch (subCMD) {
					case 'clone':
						console.log('using clone mock')
						const repoParts = remote.split('/')
						const repo = repoParts[repoParts.length - 1]
						const frmPath = path.join(__dirname, `repos/${repo}`)
						fs.copySync(frmPath, cpyPath)
						return { status: 0, error: null }
					default:
						return {
							status: 1,
							error: new Error(
								`Missing git subcommand handler ${cmd} ${subCMD}`
							)
						}
				}
			case 'yarn':
				break
			default:
				return {
					status: 1,
					error: new Error(`Missing git subcommand handler ${cmd}`)
				}
		}
		return { status: 0, error: null }
	})
}
