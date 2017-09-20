const path = require('path')
const Generator = require('yeoman-generator')

module.exports = class extends Generator {
  initializing () {
    this.sourceRoot(path.join(__dirname, 'templates'))
    this.context = {
      appname: this.options.name
    }

    this.destinationRoot(path.join(this.destinationRoot(), this.options.name))
  }
  writing () {
    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath('package.json'),
      this.context
    )

    this.fs.copyTpl(
      this.templatePath('server.js'),
      this.destinationPath('server.js'),
      this.context
    )

    this.fs.copy(
      this.templatePath('pages'),
      this.destinationPath('pages')
    )

    this.fs.copy(
      this.templatePath('containers'),
      this.destinationPath('containers')
    )
  }
}
