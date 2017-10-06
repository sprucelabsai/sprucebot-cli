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
    web: 'com-sprucebot-web',
    api: 'com-sprucebot-api',
    'dev-services': 'sprucebot-dev-services'
  }
}
