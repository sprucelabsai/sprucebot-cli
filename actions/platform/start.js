const yeoman = require('yeoman-environment')
const Start = require('../../generators/start')

const yo = yeoman.createEnv()

module.exports = function start (path, options) {
  yo.registerStub(Start, 'sprucebot')

  yo.run('sprucebot', {
    path,
    resetPrompt: options.resetPrompt
  })
}
