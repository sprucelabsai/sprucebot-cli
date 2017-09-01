const yeoman = require('yeoman-environment')
const Core = require('../../generators/core')

const yo = yeoman.createEnv()

module.exports = function init (env, options) {
  console.log('Initializing Core...')

  yo.registerStub(Core, 'sprucebot')

  yo.run('sprucebot', () => console.log('Core initialized!'))
}
