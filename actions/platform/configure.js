const yeoman = require('yeoman-environment')
const Configure = require('../../generators/configure')

const yo = yeoman.createEnv()

module.exports = function configure (env, options) {
  console.log('Configuring your environment...')

  yo.registerStub(Configure, 'sprucebot')

  yo.run('sprucebot')
}
