const path = require('path')
const config = require('config')
const chalk = require('chalk')
const inquirer = require('inquirer')
const Git = require('../../utils/Git')

const { isProjectInstalled, directoryExists } = require('../../utils/dir')

//logic in here should move to utility so it can be used outside this action
module.exports = async function version(platform = 'all', options) {
	const installPath = options.cwd || process.cwd()

	//assume we are running in single platform deployment (web or api only)
	const useRepoPath = isProjectInstalled(installPath)
	const platforms = config.get('platforms')
	const prompts = []
	const repos = {}
	for (let key in platforms) {
		if (platform === 'all' || key === platform) {
			const repo = platforms[key].repo
			const repoPath = useRepoPath
				? path.join(installPath, repo.path)
				: installPath

			if (!directoryExists(repoPath)) {
				console.log(chalk.yellow(repoPath + ' not found.'))
			} else {
				const versions = Git.listTags(repoPath)
				repos[key] = {
					name: repo.name,
					versions: versions.split('\n'),
					repoPath
				}
				if (!versions.length) {
					console.log(
						chalk.yellow(
							`Oops, the ${chalk.underline(
								repo.name
							)} repository doesn't have any available versions`
						)
					)
				} else {
					prompts.push({
						type: 'list',
						name: key,
						message: `Select the version to use for ${key}`,
						choices: versions
					})
				}
			}
		}
	}

	return inquirer.prompt(prompts).then(async answers => {
		for (let key in answers) {
			const repo = repos[key]
			Git.checkoutBranch(repo.repoPath, answers[key])
		}
		console.log(chalk.green('Version set!'))
		return answers
	})
}
