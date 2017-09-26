const {
  version,
  description
} = require('../package.json')

module.exports = {
  version,
  description,
  appname: 'sprucebot',
  gitUser: 'sprucelabsai',
  repositories: {
    web: 'com-sprucebot-hello',
    api: 'com-sprucebot-api'
  }
}
