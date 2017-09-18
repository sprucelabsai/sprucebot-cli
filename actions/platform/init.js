const yeoman = require('yeoman-environment')
const Core = require('../../generators/core')
const Version = require('../../generators/version')

const yo = yeoman.createEnv()

module.exports = async function init (path, options) {
  yo.registerStub(Core, 'sprucebot')
  yo.registerStub(Version, 'sprucebot:version')

  yo.run('sprucebot', {
    path,
    resetPrompt: options.resetPrompt,
    'skip-install': !!options.skipInstall
  })

  if (options.selectVersion) {
    yo.run('sprucebot:version')
  }
}
