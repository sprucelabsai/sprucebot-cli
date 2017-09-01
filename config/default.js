const {
  version,
  description
} = require('../package.json')

module.exports = {
  version,
  description,
  platform: {
    core: 'git@github.com:liquidg3/com-sprucebot-platform.git',
    api: 'git@github.com:liquidg3/com-sprucebot-api.git',
    web: 'git@github.com:liquidg3/com-sprucebot-hello.git'
  }
}
