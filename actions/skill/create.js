const yeoman = require('yeoman-environment')
const Create = require('../../generators/skillCreate')

const yo = yeoman.createEnv()

module.exports = async function init (name, options) {
  yo.registerStub(Create, 'sprucebot-skill')

  yo.run('sprucebot-skill', {
    name,
    resetPrompt: options.resetPrompt,
    'skip-install': !!options.skipInstall
  })
}
