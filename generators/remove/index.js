const path = require('path')
const Generator = require('yeoman-generator')
const config = require('config')
const chalk = require('chalk')

const Configure = require('../configure')

const loopbackAlias = config.get('loopbackAlias')

const {
  rmdir
} = require('../../utils/dir')

module.exports = class extends Generator {
  initializing () {
    this.promptValues = this.config.get('promptValues') || {}
    this.sourceRoot(path.join(__dirname, 'templates'))
  }

  async prompting () {
    const prompts = []

    if (!this.options.path && !this.promptValues.path) {
      prompts.push({
        type: 'input',
        name: 'path',
        message: 'I\'m having trouble finding the docker-compose.yml file',
        default: path.resolve(this.destinationRoot(), './sprucebot'),
        store: true
      })
    }

    const answers = await this.prompt(prompts)
    this.promptValues = {
      ...this.promptValues,
      path: this.options.path || this.promptValues.path || answers.path
    }

    this.destinationRoot(this.promptValues.path)
  }

  async removing () {
    const answers = await this.prompt([{
      type: 'confirm',
      name: 'confirm',
      message: `Are you sure you want me to delete ${this.promptValues.path} and all of it's contents?`,
      default: false
    }, {
      type: 'confirm',
      name: 'confirmHosts',
      message: 'Remove hosts entries?',
      default: false
    }, {
      type: 'confirm',
      name: 'confirmAlias',
      message: 'Remove loopback alias configurations?',
      default: false
    }])

    if (answers.confirmHosts) {
      try {
        Configure.Remove.apply(this, [this.options.sudoOverride])
        this.log(chalk.green('Bam! Hosts entries removed!'))
      } catch (e) {
        this.log(chalk.bold.red(`Crap, removing host entries failed. ${e.message}.`))
        this.log(chalk.bold.yellow('Try running as root.'))
      }
    }

    if (answers.confirmAlias) {
      this.fs.copyTpl(
        this.templatePath('loopbackAlias/removeLoopbackAlias.sh'),
        this.destinationPath('./loopbackAlias/removeLoopbackAlias.sh'),
        {loopbackAlias}
      )
      const cmd = this.spawnCommandSync('bash', [this.destinationPath('./loopbackAlias/removeLoopbackAlias.sh')])
      if (!cmd.error) {
        this.log(chalk.green('Boom! Loopback alias removed!'))
      } else {
        this.log(chalk.bold.red('Sh**, looks like there was an error removing loopback alias.'))
      }
    }

    if (answers.confirm) {
      rmdir(this.promptValues.path)
      this.log(chalk.green(`${this.promptValues.path} removed!`))
    }
  }
}
