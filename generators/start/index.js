const path = require('path')
const Generator = require('yeoman-generator')

module.exports = class extends Generator {
  initializing () {
    this.composeWith(require.resolve('../base'), this.options)
    this.promptValues = this.config.get('promptValues')
    this.sourceRoot(path.join(__dirname, 'templates'))
    this.destinationRoot(this.promptValues.path)
  }
  starting () {
    this.spawnCommandSync('docker-compose', ['down'], {
      cwd: this.promptValues.path
    })
    this.spawnCommandSync('docker-compose', ['build'], {
      cwd: this.promptValues.path
    })
    this.spawnCommandSync('docker-compose', ['up'], {
      cwd: this.promptValues.path
    })
  }

  end () {
    this.log('end')
  }
}
