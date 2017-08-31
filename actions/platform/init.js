const yeoman = require('yeoman-environment')
const Platform = require('../../generators/platform')

const yo = yeoman.createEnv()

module.exports = function init (env, options) {
  console.log('Initializing platform...')

  yo.registerStub(Platform, 'sprucebot')

  yo.run('sprucebot', () => console.log('Platform initialized!'))
}
