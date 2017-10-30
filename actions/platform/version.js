const path = require('path')
const config = require('config')
const Git = require('nodegit')
const chalk = require('chalk')
const inquirer = require('inquirer')

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
				const repository = await Git.Repository.open(repoPath)
				const reference = await repository.getCurrentBranch()
				const versions = await Git.Tag.list(repository)
				repos[key] = {
					name: repo.name,
					versions,
					repository
				}
				if (!versions.length) {
					versions.push(reference.name())
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
			await repo.repository.checkoutBranch(answers[key])
		}
		console.log(chalk.green('Version set!'))
		return answers
	})
}
