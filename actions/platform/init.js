const yeoman = require('yeoman-environment')
const Init = require('../../generators/init')
const Version = require('../../generators/version')

const yo = yeoman.createEnv()

module.exports = async function init (path, options) {
  yo.registerStub(Init, 'sprucebot')
  yo.registerStub(Version, 'sprucebot:version')

  yo.run('sprucebot', {
    'skip-install': !!options.skipInstall
  })

  if (options.selectVersion) {
    yo.run('sprucebot:version')
  }
}
