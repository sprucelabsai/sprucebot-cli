const {
  version,
  description
} = require('../package.json')

module.exports = {
  version,
  description,
  platform: {
    platform: 'git@github.com:liquidg3/com-sprucebot-platform.git',
    api: 'git@github.com:liquidg3/com-sprucebot-api.git',
    web: 'git@github.com:liquidg3/com-sprucebot-hello.git'
  }
}
