const path = require('path')
const Generator = require('yeoman-generator')
const config = require('config')
const hostile = require('hostile')
const {
  directoryExists,
  fileExists
} = require('../../utils/dir')

const loopbackAlias = config.get('loopbackAlias')

module.exports = class extends Generator {
  initializing () {
    this.log('initializing')
    this.sourceRoot(path.join(__dirname, 'templates'))
  }
  prompting () {
    this.log('prompting')
    return this.prompt([{
      type: 'input',
      name: 'path',
      message: 'Where should I install?',
      default: path.resolve(this.destinationRoot(), './sprucebot'),
      store: true
    }, {
      type: 'input',
      name: 'gitUser',
      message: `What is your github username?`,
      default: config.get('gitUser'),
      store: true
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
    this.destinationRoot(this.answers.path)
  }

  writingRepos () {
    if (this.options['skip-install'] !== true) {
      this.log('Writing repositories')

      const pathApi = path.resolve(this.answers.path, 'api')
      const pathWeb = path.resolve(this.answers.path, 'web')
      const gitBase = `git@github.com:${this.answers.gitUser}`

      this._cloneRepo(`${gitBase}/${config.get('repositories.api')}`, pathApi)
      this._cloneRepo(`${gitBase}/${config.get('repositories.web')}`, pathWeb)

      this.log('Writing .env files')
      fileExists(this.destinationPath('./api/app/.env.example')) && this.fs.copy(
        this.destinationPath('./api/app/.env.example'),
        this.destinationPath('./api/app/.env')
      )
      fileExists(this.destinationPath('./web/.env.example')) && this.fs.copy(
        this.destinationPath('./web/.env.example'),
        this.destinationPath('./web/.env')
      )
    }
  }

  writingTemplates () {
    this.log('writing templates')
    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath('./package.json'),
      this.answers
    )
    this.fs.copyTpl(
      this.templatePath('docker-compose.yml'),
      this.destinationPath('./docker-compose.yml'),
      {
        ...this.answers,
        loopbackAlias
      }
    )
    this.fs.copy(
      this.templatePath('docker'),
      this.destinationPath('./docker')
    )
  }

  end () {
    hostile.get(false, (err, lines) => {
      if (err) {
        this.log('Uh oh, looks like I had an issue reading the hosts file')
      }

      const configured = lines.reduce((memo, line) => {
        if (/sprucebot.com/.test(line[1])) {
          memo[line[1]] = true
        }
        return memo
      }, {})

      if (!configured['local-api.sprucebot.com'] || !configured['local.sprucebot.com'] || !configured['local-devtools.sprucebot.com']) {
        this.log('Hey it looks like you are missing your hosts config.')
        this.log('I can help you configure it by running `sudo sprucebot platform configure`')
      } else {
        this.log('Looks like everything is setup properly.')
        this.log('I can start the platform by running $ sprucebot platform start')
      }
    })
  }

  _cloneRepo (repo, path) {
    const exists = directoryExists(path)
    if (exists) {
      this.log(`Uh oh, looks like you already installed something at ${path}!`)
    } else {
      const cmd = this.spawnCommandSync('git', ['clone', repo, path])
      if (!cmd.error) {
        this.log('Cloned %s to %s', repo, path)
      } else {
        this.log('Uh oh, looks like there was a problem cloning %s', repo)
      }
    }
  }
}
