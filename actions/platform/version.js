const path = require('path')
const config = require('config')
const Git = require('nodegit')
const chalk = require('chalk')
const inquirer = require('inquirer')

const { isProjectInstalled } = require('../../utils/dir')

module.exports = async function version(installPath = process.cwd(), options) {
	if (!isProjectInstalled(installPath)) throw new Error('Halting...')

	const repositories = config.get('repositories')
	const prompts = []
	for (let repo of repositories) {
		const repository = await Git.Repository.open(
			path.join(installPath, repo.path)
		)
		const reference = await repository.getCurrentBranch()
		const versions = await Git.Tag.list(repository)
		repo.versions = versions
		repo.repository = repository
		if (!versions.length) {
			versions.push(reference.name())
			console.log(
				chalk.yellow(
					`Oops, the ${chalk.underline(
						repo.name
					)} repository doesn't have any available versions`
				)
			)
			console.log(chalk.yellow('I can only use the currently active branch'))
		}
		prompts.push({
			type: 'list',
			name: `${repo.name}Version`,
			message: `Select the version to use for ${repo.name}`,
			choices: versions
		})
	}

	return inquirer.prompt(prompts).then(async answers => {
		for (let repo of repositories) {
			const version = `${repo.name}Version`
			console.log(`Checkout out ${repo.name}:${answers[version]}...`)
			await repo.repository.checkoutBranch(answers[version])
			console.log(`Finished ${repo.name}:${answers[version]}`)
		}
		return answers
	})
}
