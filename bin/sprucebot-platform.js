#!/usr/bin/env node

const platform = require('../actions/platform')

module.exports = platform(process.argv)
