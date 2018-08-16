#!/usr/bin/env node
const chalk = require('chalk')
const assert = require('assert')

const skill = require('../actions/skill')
module.exports = skill(process.argv)
