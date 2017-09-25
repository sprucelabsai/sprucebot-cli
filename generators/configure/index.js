const path = require('path')
const hostile = require('hostile')
const chalk = require('chalk')

const Generator = require('yeoman-generator')

module.exports = class extends Generator {
  static Remove (sudoOverride = false) {
    if (!sudoOverride && process.getuid() !== 0) {
      throw new Error('Generator needs root access to write hosts file')
    }

    const lines = hostile.getFile(path.join(__dirname, 'templates/hosts'), false)
    lines.forEach(line => {
      console.log('Removing host %s %s from hosts file', line[0], line[1])
      hostile.remove(line[0], line[1])
    })
  }

  async initializing () {
    this.sourceRoot(path.join(__dirname, 'templates'))

    if (!this.options.hostile) {
      this.hostile = hostile
    } else {
      // Passing hostile as an argument allows us to stub it's api for unit tests
      this.hostile = this.options.hostile
    }
    if (!this.options.sudoOverride && process.getuid() !== 0) {
      this.env.error(chalk.bold.red('I need root access to write hosts file!'))
    }
  }

  configuring () {
    try {
      const lines = this.hostile.getFile(this.templatePath('hosts'), false)
      const setLines = this.hostile.get() // Parse current hosts file
      const missingLines = lines.filter(line => {
        // Determine if hostname is already set for this line
        return setLines.findIndex(l => l[1] === line[1]) === -1
      })
      if (missingLines.length) {
        missingLines.forEach(line => {
          this.log(`Adding host ${line[1]} to your hosts file.`)
          this.hostile.set(line[0], line[1])
        })
      } else {
        this.log('Looks like your hosts file is setup properly. 💪')
      }
    } catch (e) {
      this.env.error(chalk.bold.red(`Uh oh, I couldn't read your hosts file. Try Googling 'Sprucebot platform hosts'`))
    }
  }

  writing () {
    const destination = this.destinationPath('cert/barbershop.ca.crt')
    this.fs.copy(
      this.templatePath('barbershop.ca.crt'),
      destination
    )
  }

  install () {
    // Install phase can expect the file system to be written
    this.spawnCommandSync('security', ['add-trusted-cert', '-d', '-r', 'trustRoot', '-k', '/Library/Keychains/System.keychain', `${this.destinationPath('cert/barbershop.ca.crt')}`])

    // Build composer
    // Bring down just to be safe
    this.spawnCommandSync('docker-compose', ['down'])
    this.spawnCommandSync('docker-compose', ['build'])
    this.config.set('did-build', true)
  }

  end () {
    this.log(chalk.green('Heck yeah! Everything looks good.'))
    this.log(chalk.yellow('Run `sprucebot platform start`  🌲 🤖'))
  }
}
