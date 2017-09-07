const yeoman = require('yeoman-environment')
const Configure = require('../../generators/configure')

const yo = yeoman.createEnv()

module.exports = function init (env, options) {
  console.log('Configuring your environment...')

  yo.registerStub(Configure, 'sprucebot')

  yo.run('sprucebot', () => console.log('Configure task finished!'))
}
