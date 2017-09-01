const yeoman = require('yeoman-environment')
const Platform = require('../../generators/platform')

const env = yeoman.createEnv()

module.exports = function init (...args) {
  console.log('initializing packages')

  env.registerStub(Platform, 'sprucebot')

  env.run('sprucebot', () => console.log('Done!'))
}
