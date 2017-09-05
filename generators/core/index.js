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
  // fs.stat requires a callback, so we have to Promise
  return new Promise((resolve) => {
    fs.stat(path, (err, stats) => {
      if (err) {
        return resolve(false)
      }
      if (stats.isDirectory()) {
        resolve(true)
      } else {
        resolve(false)
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
      default: path.resolve(this.destinationRoot(), './sprucebot')
    },
      captureRepo('platform'),
      captureRepo('api'),
      captureRepo('web')
    ]).then(answers => {
      this.answers = {
        ...answers,
        appname: 'sprucebot',
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
    const pathApi = path.resolve(this.answers.path, 'api')
    const pathWeb = path.resolve(this.answers.path, 'web')

    this._cloneRepo(this.answers.platform, pathPlatform)
    this._cloneRepo(this.answers.api, pathApi)
    this._cloneRepo(this.answers.web, pathWeb)
  }

  writingTemplates () {
    this.fs.copyTpl(
      this.templatePath('./core/package.json'),
      this.destinationPath('./package.json'),
      this.answers
    )
  }

  end () { this.log('end') }

  async _cloneRepo (repo, path) {
    const exists = await directoryExists(path)
    if (exists) {
      this.log(`Uh oh, looks like you already installed something at ${path}!`)
    } else {
      this.spawnCommandSync('git', ['clone', repo, path])
    }
  }
}
