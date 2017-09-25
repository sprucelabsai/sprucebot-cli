#!/usr/bin/env node
const {
  spawnSync
} = require('child_process')

function patch (branch) {
  console.log('Running npm version patch')
  const patch = spawnSync('npm', ['version', 'patch', '-m', '"[skip ci] version patch"'])

  if (patch.status === 0) {
    const push = spawnSync('git', ['push', 'origin', `HEAD:${branch}`, '--follow-tags'])

    if (push.status !== 0) {
      throw new Error(push.stderr.toString())
    }
  } else {
    throw new Error(patch.stderr.toString())
  }
}

if (process.env.TRAVIS_PULL_REQUEST !== 'false') {
  // We don't want to version bump on PRs
  process.exit(0)
}

switch (process.env.TRAVIS_BRANCH) {
  case 'dev':
    patch(process.env.TRAVIS_BRANCH)
    break
  default:
    console.log('Version bump was ignored on branch %s', process.env.TRAVIS_BRANCH)
}
