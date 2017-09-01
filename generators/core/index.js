const path = require('path')
const Generator = require('yeoman-generator')
const config = require('config')

function captureRepo (name) {
  return {
    type: 'input',
    name,
    message: `What is the url for the ${name} git repository?`,
    default: config.get(`platform.${name}`)
  }
}

module.exports = class extends Generator {
  initializing () { this.log('initializing') }
  prompting () {
    this.log('prompting')
    return this.prompt([{
      type: 'input',
      name: 'path',
      message: 'Where should we install it?',
      default: this.destinationRoot()
    },
      captureRepo('core'),
      captureRepo('api'),
      captureRepo('web')
    ]).then(answers => {
      this.answers = {
        ...answers,
        path: path.resolve(answers.path)
      }
    })
  }
  configuring () {
    this.log('configuring')
    this.log(this.answers)
    this.log(this.sourceRoot())
    this.destinationRoot(this.answers.path)
  }

  writing () {
    this.log('writing')
    this.spawnCommandSync('git', ['clone', this.answers.core, `${this.answers.path}/core`])
    this.spawnCommandSync('git', ['clone', this.answers.web, `${this.answers.path}/web`])
    this.spawnCommandSync('git', ['clone', this.answers.api, `${this.answers.path}/api`])
  }
  end () { this.log('end') }
}
