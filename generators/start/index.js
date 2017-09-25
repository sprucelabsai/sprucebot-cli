const chalk = require('chalk')
const Generator = require('yeoman-generator')

const {
  fileExists
} = require('../../utils/dir')

module.exports = class extends Generator {
  configuring () {
    if (!fileExists(this.destinationPath('docker-compose.yml'))) {
      this.env.error(chalk.bold.red(`Uh oh, I can't find a valid docker-compose.yml in ${this.destinationPath()}. Try Googling 'Sprucebot platform docker-compose'.`))
    }
  }

  starting () {
    this.spawnCommandSync('docker-compose', ['down'])

    // If we have not first run, lets build
    if (!this.config.get('did-build')) {
      this.config.set('did-build', true)
      this.spawnCommandSync('docker-compose', ['build'])
    }

    this.spawnCommandSync('docker-compose', ['up'])
  }

  end () {
    this.log('end')
  }
}
