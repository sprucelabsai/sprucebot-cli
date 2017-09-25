const path = require('path')
const hostile = require('hostile')
const chalk = require('chalk')
const defaultConfig = require('config')
const Generator = require('yeoman-generator')

const {
  directoryExists,
  fileExists
} = require('../../utils/dir')

module.exports = class extends Generator {
  constructor (args, ops) {
    super(args, ops)
    // Questions we ask before init
    this._prompts = {
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
  }

  async initializing () {
    this.sourceRoot(path.join(__dirname, 'templates'))
    let cliPath = path.resolve(__dirname, '..', '..')
    if (cliPath === this.destinationRoot()) {
      this.env.error(chalk.bold.red('You cannot run `sprucebot platform init` from inside the sprucebot-cli directory.'))
    }
  }

  async prompting () {
    const active = []

    this.promptValues = {
      path: this.options.path,
      gitUser: this.options.gitUser
    }

    // Default destination
    if (!this.promptValues.path) {
      this._prompts.path.default = path.resolve(this.destinationRoot(), './sprucebot')
      active.push(this._prompts.path)
    }

    // Attempt to read the github username configured on system to set as default
    if (!this.promptValues.gitUser) {
      try {
        this._prompts.gitUser.default = await this.user.github.username()
      } catch (e) {
      }
      active.push(this._prompts.gitUser)
    }

    if (active.length > 0) {
      const values = await this.prompt(active)
      this.promptValues = Object.assign(this.promptValues, values)
    }
    this.destinationRoot(this.promptValues.path)
  }

  writingRepos () {
    if (this.options['skip-install'] !== true) {
      this.log('Cloning platform repositories...')

      const pathApi = path.resolve(this.promptValues.path, 'api')
      const pathWeb = path.resolve(this.promptValues.path, 'web')
      const gitBase = `git@github.com:${this.promptValues.gitUser}`

      this._cloneRepo(`${gitBase}/${defaultConfig.repositories.api}`, pathApi)
      this._cloneRepo(`${gitBase}/${defaultConfig.repositories.web}`, pathWeb)

      this.log('Writing .env files...')
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
    this.log('Populating and copying templates...')
    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath('./package.json'),
      {...this.promptValues, appname: defaultConfig.appname}
    )
    this.fs.copyTpl(
      this.templatePath('docker-compose.yml'),
      this.destinationPath('./docker-compose.yml'),
      this.promptValues
    )
    this.fs.copyTpl(
      this.templatePath('hosts'),
      this.destinationPath('./hosts'),
      this.promptValues
    )
    this.fs.copy(
      this.templatePath('docker'),
      this.destinationPath('./docker')
    )
    this.fs.copy(
      this.templatePath('.yo-rc.json'),
      this.destinationPath('./.yo-rc.json')
    )
  }

  end () {
    hostile.get(false, (err, lines) => {
      if (err) {
        this.env.error(chalk.bold.red('Oh sh**, I had an issue reading your hosts file. Google `Sprucebot hosts file` for help.'))
      }

      const configured = lines.reduce((memo, line) => {
        if (/sprucebot.com/.test(line[1])) {
          memo[line[1]] = true
        }
        return memo
      }, {})

      // Help dev cd to correct directory
      let dir = path.basename(this.promptValues.path)

      if (!configured['local-api.sprucebot.com'] || !configured['local.sprucebot.com'] || !configured['local-devtools.sprucebot.com']) {
        this.log(chalk.green(`Sweet! We're almost done! Last step is configuring your host file.`))
        this.log(chalk.yellow(`Don't` + ' sweat it though, run `cd ' + dir + ' && sudo sprucebot platform configure`'))
      } else {
        this.log(chalk.green('Heck yeah! I double checked and everything looks good.'))
        this.log(chalk.yellow('Run `cd ' + dir + ' && sprucebot platform start`  🌲 🤖'))
      }
    })
  }

  _cloneRepo (repo, path) {
    const exists = directoryExists(path)
    if (exists) {
      this.log(`Oh snap, looks like you already installed something at ${path}! Skipping for now.`)
    } else {
      // TODO - Make sure this halts when github public key is missing
      const cmd = this.spawnCommandSync('git', ['clone', repo, path])
      if (!cmd.error) {
        this.log(chalk.green(`Finished cloning ${repo} to ${path}.`))
      } else {
        this.log(chalk.bold.red(`CRAP, looks like there was a problem cloning ${repo}.`))
      }
    }
  }
}
