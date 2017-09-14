const path = require('path')
const Generator = require('yeoman-generator')

const {
  fileExists
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

    if (!fileExists(path.join(this.promptValues.path, 'docker-compose.yml'))) {
      throw new Error(`Uh oh, I can't find a valid docker-compose.yml in ${this.promptValues.path}`)
    }
  }

  starting () {
    this.spawnCommandSync('docker-compose', ['up'], {
      cwd: this.promptValues.path
    })
  }

  end () {
    this.log('end')
  }
}
