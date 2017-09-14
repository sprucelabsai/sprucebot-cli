const path = require('path')
const Generator = require('yeoman-generator')
const config = require('config')

const Configure = require('../configure')

const loopbackAlias = config.get('loopbackAlias')

const {
  rmdir
} = require('../../utils/dir')

module.exports = class extends Generator {
  initializing () {
    this.log('initializing')
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
      message: `Are you sure you want to remove directory ${this.promptValues.path} and all of it's contents?`,
      default: false
    }, {
      type: 'confirm',
      name: 'confirmHosts',
      message: 'Are you sure you want to remove hosts configurations?',
      default: false
    }, {
      type: 'confirm',
      name: 'confirmAlias',
      message: 'Are you sure you want to remove loopback alias configurations?',
      default: false
    }])

    if (answers.confirmHosts) {
      Configure.Remove.apply(this, [this.options.sudoOverride])
      this.log('Hosts configuration removed!')
    }

    if (answers.confirmAlias) {
      this.fs.copyTpl(
        this.templatePath('loopbackAlias/removeLoopbackAlias.sh'),
        this.destinationPath('./loopbackAlias/removeLoopbackAlias.sh'),
        { loopbackAlias }
      )
      const cmd = this.spawnCommandSync('bash', [this.destinationPath('./loopbackAlias/removeLoopbackAlias.sh')])
      if (!cmd.error) {
        this.log('Loopback Alias configuration removed!')
      } else {
        this.log('Uh oh, looks like there was an error removing loopback alias')
      }
    }

    if (answers.confirm) {
      rmdir(this.promptValues.path)
      this.log(`${this.promptValues.path} removed!`)
    }
  }
}
