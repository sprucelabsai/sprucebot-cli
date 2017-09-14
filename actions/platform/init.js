const yeoman = require('yeoman-environment')
const Core = require('../../generators/core')

const yo = yeoman.createEnv()

module.exports = function init (env, options) {
  yo.registerStub(Core, 'sprucebot')

  yo.run('sprucebot', {
    'skip-install': !!options.skipInstall
  })
}
