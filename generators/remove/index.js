const path = require('path')
const Generator = require('yeoman-generator')

const Configure = require('../configure')

const {
  rmdir
} = require('../../utils/dir')

module.exports = class extends Generator {
  initializing () {
    this.log('initializing')
    this.promptValues = this.config.get('promptValues') || {}
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
  }

  async removing () {
    const answers = await this.prompt([{
      type: 'confirm',
      name: 'confirm',
      message: `Are you sure you want to remove directory ${this.promptValues.path} and all of it's contents?`,
      default: false
    }, {
      type: 'confirm',
      name: 'confirmAlias',
      message: 'Are you sure you want to remove network loopback alias and hosts configurations?',
      default: false
    }])

    if (answers.confirm) {
      rmdir(this.promptValues.path)
      this.log(`${this.promptValues.path} removed!`)
    }

    if (answers.confirmAlias) {
      Configure.Remove.apply(this, [this.options.sudoOverride])
      this.log('Loopback alias and hosts configurations removed!')
    }
  }
}
