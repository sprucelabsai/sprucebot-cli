var Generator = require('yeoman-generator')

module.exports = class extends Generator {
  initializing () { this.log('initializing') }
  prompting () {
    this.log('prompting')
    return this.prompt([{
      type: 'list',
      name: 'installType',
      message: 'What platform would you like to initialize?',
      choices: ['Skill', 'Core']
    }]).then(answers => {
      this.answers = answers
    })
  }
  configuring () {
    this.log('configuring')
    this.log(this.answers)
  }

  writing () {
    this.log('writing')
    switch (this.answers.installType) {
      case 'Core':
        this.composeWith(require.resolve('../core'))
        break
      case 'Skill':
        this.composeWith(require.resolve('../skill'))
        break
      default: throw new Error('Something went wrong selecting the platform')
    }
  }
  end () { this.log('end') }
}
