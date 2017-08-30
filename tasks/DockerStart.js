/**
 * Exectue the `docker start` command of the package
 * @param {array} options Options passed to the package
 */
function dockerStart (options) {
  console.log('Docker Run command reached', ...options)
}

module.exports = dockerStart
