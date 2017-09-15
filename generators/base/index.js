const path = require('path')
const Generator = require('yeoman-generator')
const config = require('config')

module.exports = class extends Generator {
  initializing () {
    this.config.defaults({
      promptValues: {
        appname: 'sprucebot'
      }
    })

    this.promptValues = {
      ...this.config.get('promptValues') || {},
      ...this.options
    }
  }
  prompting () {
    const prompts = []
    if (!this.promptValues.path) {
      prompts.push({
        type: 'input',
        name: 'path',
        message: 'Install location',
        default: path.resolve(this.destinationRoot(), './sprucebot'),
        store: true
      })
    }

    if (!this.promptValues.gitUser) {
      prompts.push({
        type: 'input',
        name: 'gitUser',
        message: `Github username`,
        default: config.get('gitUser'),
        store: true
      })
    }

    return this.prompt(prompts).then(() => {
      this.promptValues = {
        ...this.config.get('promptValues'),
        ...this.options
      }
      this.config.set('promptValues', this.promptValues)
    })
  }
}
