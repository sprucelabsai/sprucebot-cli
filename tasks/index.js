const Platform = require('./Platform')

module.exports = function tasks (program) {
  return {
    platform: new Platform(program)
  }
}
