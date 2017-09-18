const path = require('path')
const Generator = require('yeoman-generator')
const config = require('config')

const prompts = {
  path: {
    type: 'input',
    name: 'path',
    message: 'Install location',
    default: null,
    store: true
  },
  gitUser: {
    type: 'input',
    name: 'gitUser',
    message: `Github username`,
    default: null,
    store: true
  }
}

function parseOptions (options) {
  return Object.keys(options).reduce((memo, key) => {
    if (typeof options[key] !== 'undefined' && prompts[key]) {
      memo[key] = options[key]
    }
    return memo
  }, {})
}

module.exports = class extends Generator {
  initializing () {
    this.config.defaults({
      promptValues: {
        appname: 'sprucebot'
      }
    })

    this.promptValues = {
      ...this.config.get('promptValues') || {},
      ...parseOptions(this.options)
    }
  }
  async prompting () {
    const active = []
    if (!this.promptValues.path) {
      prompts.path.default = path.resolve(this.destinationRoot(), './sprucebot')
      active.push(prompts.path)
    }

    if (!this.promptValues.gitUser) {
      try {
        // Attempt to read the github username configured on system
        prompts.gitUser.default = await this.user.github.username()
      } catch (e) {
        prompts.gitUser.default = config.get('gitUser')
      }
      active.push(prompts.gitUser)
    }

    return this.prompt(active).then((answers) => {
      this.promptValues = {
        ...this.config.get('promptValues'),
        ...parseOptions(this.options),
        ...answers
      }
      this.config.set('promptValues', this.promptValues)
    })
  }
}
