const yeoman = require('yeoman-environment')
const Version = require('../../generators/version')

const yo = yeoman.createEnv()

module.exports = async function init (path, options) {
  yo.registerStub(Version, 'sprucebot:version')

  yo.run('sprucebot:version', options)
}
