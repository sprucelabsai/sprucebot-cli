const yeoman = require('yeoman-environment')
const Core = require('../../generators/core')

const yo = yeoman.createEnv()

module.exports = function init (path, options) {
  yo.registerStub(Core, 'sprucebot')

  yo.run('sprucebot', {
    path,
    'skip-install': !!options.skipInstall
  })
}
