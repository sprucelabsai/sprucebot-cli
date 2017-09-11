const fs = require('fs')
const path = require('path')

/**
 * Recursively remove dir and containing files/folders
 * @param {string} dirPath base path to recursively remove
 */
exports.rmdir = function rmdir (dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach(function (entry) {
      var entryPath = path.join(dirPath, entry)
      if (fs.lstatSync(entryPath).isDirectory()) {
        rmdir(entryPath)
      } else {
        fs.unlinkSync(entryPath)
      }
    })
    fs.rmdirSync(dirPath)
  }
}

/**
 * Recursively create a directory if it doesn't already exist
 * @param {string} dir the directory path to create
 */
exports.createDir = function createDir (dir) {
  dir.split(path.sep).reduce((parent, child) => {
    const curDir = path.join(parent, child)
    if (!fs.existsSync(curDir)) {
      fs.mkdirSync(curDir)
    }
    return curDir
  }, path.isAbsolute(dir) ? path.sep : '')
}

/**
 * Returns true if path is directory
 * Returns false if path is a file or doesn't exist
 * @param {string} path file or directory to test
 */
exports.directoryExists = function directoryExists (path) {
  let stats
  try {
    stats = fs.statSync(path)
    return stats.isDirectory()
  } catch (e) {
    // Directory probably doesn't exist
    return false
  }
}

exports.fileExists = function fileExists (path) {
  let stats
  try {
    stats = fs.statSync(path)
    return stats.isFile()
  } catch (e) {
    // Path is not a file
    return false
  }
}
