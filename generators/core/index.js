const path = require('path')
const fs = require('fs')
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

function directoryExists (path) {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
      if (err) {
        reject(new Error('Path does not exist'))
      }
      if (stats.isDirectory()) {
        resolve(path)
      } else {
        reject(new Error('Path is not a directory'))
      }
    })
  })
}

module.exports = class extends Generator {
  initializing () {
    this.log('initializing')
  }
  prompting () {
    this.log('prompting')
    return this.prompt([{
      type: 'input',
      name: 'path',
      message: 'Where should I install?',
      default: path.resolve(this.destinationRoot() + '/sprucebot')
    },
      captureRepo('platform'),
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
    this.destinationRoot(this.answers.path)
  }

  writing () {
    this.log('writing')
    const pathPlatform = path.resolve(this.answers.path, 'platform')
    const pathWeb = path.resolve(this.answers.path, 'web')
    const pathApi = path.resolve(this.answers.path, 'api')
    directoryExists()
      .then(() => console.log(`${pathPlatform} already exists`))
      .catch(() => this.spawnCommandSync('git', ['clone', this.answers.platform, pathPlatform]))
    directoryExists()
      .then(() => console.log(`${pathWeb} already exists`))
      .catch(() => this.spawnCommandSync('git', ['clone', this.answers.platform, pathWeb]))
    directoryExists()
      .then(() => console.log(`${pathApi} already exists`))
      .catch(() => this.spawnCommandSync('git', ['clone', this.answers.platform, pathApi]))
  }

  writingTemplates () {
    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath('package.json'),
      this.answers
    )
  }
  end () { this.log('end') }
}
