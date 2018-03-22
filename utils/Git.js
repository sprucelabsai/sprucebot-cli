const { spawnSync } = require('child_process')
const chalk = require('chalk')

function spawnGit(cwd, args, options) {
	const cmd = spawnSync('git', args, {
		env: process.env,
		cwd,
		...options
	})

	if (cmd.status !== 0) {
		const message =
			(cmd.stderr && cmd.stderr.toString && cmd.stderr.toString()) ||
			'Unknown Git Error'
		console.error(chalk.yellow(message))
		return new Error(message)
	}

	return Buffer.isBuffer(cmd.stdout) ? cmd.stdout.toString() : ''
}

module.exports.listTags = listTags
function listTags(repoPath) {
	return spawnGit(repoPath, ['tag', '--list'])
}

module.exports.checkoutBranch = checkoutBranch
function checkoutBranch(repoPath, branch) {
	return spawnGit(repoPath, ['checkout', branch])
}

module.exports.Remote = {
	delete: deleteRemote,
	create: createRemote
}
function deleteRemote(repoPath, remote) {
	return spawnGit(repoPath, ['remote', 'remove', remote])
}

function createRemote(repoPath, remote, destination) {
	return spawnGit(repoPath, ['remote', 'add', remote, destination])
}
