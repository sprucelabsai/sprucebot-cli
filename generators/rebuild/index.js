const chalk = require('chalk')
const Generator = require('yeoman-generator')

module.exports = class extends Generator {
  building () {
    // Bring down just to be safe
    this.spawnCommandSync('docker-compose', ['down'])
    this.spawnCommandSync('docker-compose', ['build'])
  }

  end () {
    this.log(chalk.green('Everything is built and ready! 💪'))
    this.log(chalk.yellow('Run `sprucebot platform start`  🌲 🤖'))
  }
}
