const yeoman = require('yeoman-environment')
const Remove = require('../../generators/remove')

const yo = yeoman.createEnv()

module.exports = function remove (path, options) {
  yo.registerStub(Remove, 'sprucebot')

  yo.run('sprucebot', {
    path,
    resetPrompt: options.resetPrompt
  })
}
