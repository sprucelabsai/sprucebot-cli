const path = require('path')
const fs = require('fs')
const Generator = require('yeoman-generator')
const config = require('config')

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
    }, {
      type: 'input',
      name: 'gitUser',
      message: `What is your github username?`,
      default: config.get('gitUser')
    }]).then(answers => {
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

  writingRepos () {
    this.log('writing')

    const pathApi = path.resolve(this.answers.path, 'api')
    const pathWeb = path.resolve(this.answers.path, 'web')
    const gitBase = `git@github.com:${this.answers.gitUser}`

    this._cloneRepo(`${gitBase}/${config.get('repositories.api')}`, pathApi)
    this._cloneRepo(`${gitBase}/${config.get('repositories.web')}`, pathWeb)
  }

  writingTemplates () {
    this.log('writing templates')
    this.fs.copyTpl(
      this.templatePath('./core/package.json'),
      this.destinationPath('./package.json'),
      this.answers
    )
    this.fs.copyTpl(
      this.templatePath('./core/docker-compose.yml'),
      this.destinationPath('./docker-compose.yml'),
      this.answers
    )
    this.fs.copy(
      this.templatePath('./core/docker'),
      this.destinationPath('./docker')
    )

    this.log('Writing .env files')
    this.fs.copy(
      this.destinationPath('./api/app/.env.example'),
      this.destinationPath('./api/app/.env')
    )
    this.fs.copy(
      this.destinationPath('./web/.env.example'),
      this.destinationPath('./web/.env')
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
