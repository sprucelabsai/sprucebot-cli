const {
  version,
  description
} = require('../package.json')

module.exports = {
  version,
  description,
  gitUser: 'sprucelabsai',
  loopbackAlias: '10.200.10.1',
  repositories: {
    web: 'com-sprucebot-hello',
    api: 'com-sprucebot-api'
  }
}
