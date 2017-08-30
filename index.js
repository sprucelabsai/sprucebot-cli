const pkg = require('./package.json')

throw new Error('The ' + pkg.name + ' is a cli tool only. Visit the repo ' + pkg.repository)
