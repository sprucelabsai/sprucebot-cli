#!/usr/bin/env node
const {
  spawnSync
} = require('child_process')

function patch () {
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

switch (process.env.TRAVIS_BRANCH) {
  case 'dev':
    patch()
    break
  default:
    console.log('Version bump was ignored on branch %s', process.env.TRAVIS_BRANCH)
}
