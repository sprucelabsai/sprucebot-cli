const path = require('path')
const chalk = require('chalk')
const config = require('config')
const Git = require('nodegit')

const Generator = require('../base')

module.exports = class extends Generator {
  async initializing () {
    this.sourceRoot(path.join(__dirname, 'templates'))
    this.promptValues = await this.getPromptValues()
    this.destinationRoot(this.promptValues.path)
  }

  async writing () {
    const repositoriesConfig = config.get('repositories')
    const repositories = Object.keys(config.get('repositories')).reduce((repos, repo) => ({
      ...repos,
      [repo]: {
        name: repositoriesConfig[repo],
        versions: []
      }
    }), {})
    const prompts = []
    for (let repo of Object.keys(repositories)) {
      const repository = await Git.Repository.open(path.join(this.promptValues.path, repo))
      const reference = await repository.getCurrentBranch()
      const versions = await Git.Tag.list(repository)
      repositories[repo].repository = repository
      repositories[repo].versions = versions
      if (!versions.length) {
        versions.push(reference.name())
        this.log(chalk.yellow(`Oops, the ${chalk.underline(repositories[repo].name)} repository doesn't have any available versions`))
        this.log(chalk.yellow('I can only use the currently active branch'))
      }
      prompts.push({
        type: 'list',
        name: `${repo}Version`,
        message: `Select the version to use for ${repositories[repo].name}`,
        choices: versions
      })
    }

    return this.prompt(prompts).then(async (answers) => {
      for (let repo of Object.keys(repositories)) {
        this.log(`Checkout out ${repositories[repo].name}:${answers[`${repo}Version`]}...`)
        await repositories[repo].repository.checkoutBranch(answers[`${repo}Version`])
        this.log(`Finished ${repositories[repo].name}:${answers[`${repo}Version`]}`)
      }
    })
  }
}
