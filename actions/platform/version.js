const path = require('path')
const config = require('config')
const Git = require('nodegit')
const chalk = require('chalk')
const inquirer = require('inquirer')

const { isProjectInstalled } = require('../../utils/dir')

process.on('unhandledrejection', e => console.error(e))

module.exports = async function version(installPath = process.cwd(), options) {
	if (!isProjectInstalled(installPath)) throw new Error('Halting...')

	const repositoriesConfig = config.get('repositories')
	const repositories = Object.keys(repositoriesConfig).reduce(
		(repos, repo) => ({
			...repos,
			[repo]: {
				name: repositoriesConfig[repo],
				versions: []
			}
		}),
		{}
	)
	const prompts = []
	for (let repo of Object.keys(repositories)) {
		const repository = await Git.Repository.open(path.join(installPath, repo))
		const reference = await repository.getCurrentBranch()
		const versions = await Git.Tag.list(repository)
		repositories[repo].repository = repository
		repositories[repo].versions = versions
		if (!versions.length) {
			versions.push(reference.name())
			console.log(
				chalk.yellow(
					`Oops, the ${chalk.underline(
						repositories[repo].name
					)} repository doesn't have any available versions`
				)
			)
			console.log(chalk.yellow('I can only use the currently active branch'))
		}
		prompts.push({
			type: 'list',
			name: `${repo}Version`,
			message: `Select the version to use for ${repositories[repo].name}`,
			choices: versions
		})
	}

	return inquirer.prompt(prompts).then(async answers => {
		for (let repo of Object.keys(repositories)) {
			console.log(
				`Checkout out ${repositories[repo].name}:${answers[
					`${repo}Version`
				]}...`
			)
			await repositories[repo].repository.checkoutBranch(
				answers[`${repo}Version`]
			)
			console.log(
				`Finished ${repositories[repo].name}:${answers[`${repo}Version`]}`
			)
		}
	})
}
