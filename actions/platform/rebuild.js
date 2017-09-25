const yeoman = require('yeoman-environment')
const Rebuild = require('../../generators/rebuild')

const yo = yeoman.createEnv()

module.exports = function remove (path, options) {
  yo.registerStub(Rebuild, 'sprucebot')

  yo.run('sprucebot')
}
