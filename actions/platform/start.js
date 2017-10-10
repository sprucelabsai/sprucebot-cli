const path = require('path')
const chalk = require('chalk')
const {spawnSync} = require('child_process')
const {
  fileExists
} = require('../../utils/dir')

module.exports = function start (optPath, options) {
  const ecosystem = path.join(process.cwd(), './ecosystem.config.js')
  if (!fileExists(ecosystem)) {
    console.error(chalk.red.bold(`Crap! I can't find a valid ecosystem.config.js in ${ecosystem}`))
  }

  const cmd = spawnSync('yarn', ['run', 'start'], {cwd: process.cwd(), stdio: 'inherit'})

  if (cmd.status !== 0) {
    console.error(cmd.error)
    console.error(chalk.bold.red('SCREEEETCH. Looks like something went wrong.'))
  } else {
    console.log(chalk.green('VROOOOOOOOMMM. I think it\'s working! 🌲🤖'))
  }
}
