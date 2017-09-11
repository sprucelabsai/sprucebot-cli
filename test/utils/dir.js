/* eslint-env mocha */
const fs = require('fs')
const path = require('path')

const { assert } = require('chai')

const {
  rmdir,
  createDir,
  directoryExists,
  fileExists
} = require('../../utils/dir')

const TEMP = path.join(__dirname, '../../__TEST__')

describe('Directory Utility Functions', () => {
  after(() => {
    rmdir(TEMP)
  })
  it('creates a directory', () => {
    const dir = path.join(TEMP, 'create')
    createDir(dir)
    const stats = fs.statSync(dir)
    assert.ok(stats.isDirectory())
  })
  it('deletes a directory', () => {
    const dir = path.join(TEMP, 'delete')
    createDir(dir)
    rmdir(dir)
    try {
      fs.statSync(dir)
      assert.notOk(true, 'statSync should have thrown error ')
    } catch (e) {
      assert.include(e.message, 'ENOENT')
    }
  })
  it('checks if directory exists', () => {
    const dir = path.join(TEMP, 'check')
    let exists = directoryExists(dir)
    assert.notOk(exists)
    createDir(dir)
    exists = directoryExists(dir)
    assert.ok(exists)
  })
  it('checks if file exists', () => {
    const file = path.join(TEMP, 'file.txt')
    assert.notOk(fileExists(file))
    fs.writeFileSync(file, 'Hello World!')
    assert.ok(fileExists(file))
  })
})
