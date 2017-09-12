#!/usr/bin/env node
const {
  spawnSync
} = require('child_process')

const rev = spawnSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'])

const branch = rev.stdout
  .toString()
  .replace(/\s/g, '')

if (branch === 'dev') {
  console.log('Running npm version patch')
  const patch = spawnSync('npm', ['version', 'patch', '-m', '"[skip ci] version patch"'])

  if (patch.status === 0) {
    const push = spawnSync('git', ['push', '--follow-tags'])

    if (push.status !== 0) {
      throw new Error(push.stderr.toString())
    }
  } else {
    throw new Error(patch.stderr.toString())
  }
}
