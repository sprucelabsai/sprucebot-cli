/**
 * Exectue the `npm start` command of the package
 * @param {array} options Options passed to the package
 */
function npmStart (options) {
  console.log('Start command reached', ...options)
}

module.exports = npmStart
