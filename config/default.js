const path = require('path')
const { version, description } = require('../package.json')

const TEMP = path.join(__dirname, '../__TEST__')

module.exports = {
	version,
	description,
	TEMP,
	appname: 'sprucebot',
	gitUser: 'sprucelabsai',
	repositories: [
		{
			name: 'com-sprucebot-web',
			path: './web'
		},
		{
			name: 'com-sprucebot-api',
			path: './api'
		},
		{
			name: 'sprucebot-dev-services',
			path: './sprucebot-dev-services'
		},
		{
			name: 'sprucebot-relay',
			path: './sprucebot-relay'
		}
	]
}
