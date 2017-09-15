const path = require('path')
const Generator = require('yeoman-generator')
const chalk = require('chalk')

const Configure = require('../configure')

const {
  rmdir
} = require('../../utils/dir')

module.exports = class extends Generator {
  initializing () {
    this.composeWith(require.resolve('../base'), this.options)
    this.promptValues = this.config.get('promptValues')
    this.sourceRoot(path.join(__dirname, 'templates'))
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

    if (answers.confirm) {
      rmdir(this.promptValues.path)
      this.log(chalk.green(`${this.promptValues.path} removed!`))
    }
  }
}
