const path = require('path')
const { version, description } = require('../package.json')

const TEMP = path.join(__dirname, '../__TEST__')

module.exports = {
	version,
	description,
	TEMP,
	appname: 'sprucebot',
	gitUser: 'sprucelabsai',
	platforms: {
		api: {
			repo: {
				name: 'com-sprucebot-api',
				env: './app',
				path: './api'
			},
			pm2: {
				name: 'Sprucebot API'
			}
		},
		web: {
			repo: {
				name: 'com-sprucebot-web',
				env: './',
				path: './web'
			},
			pm2: {
				name: 'Sprucebot Web'
			}
		},
		dev: {
			repo: {
				name: 'sprucebot-dev-services',
				path: './dev-services',
				env: false
			},
			pm2: {
				name: 'Sprucebot Dev Services'
			}
		},
		relay: {
			repo: {
				name: 'sprucebot-relay',
				path: './relay',
				env: false
			},
			pm2: {
				name: 'Sprucebot Relay'
			}
		}
	}
}
