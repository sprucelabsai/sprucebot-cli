const path = require('path')
const { version, description } = require('../package.json')

const TEMP = path.join(__dirname, '../../__TEMP__')

module.exports = {
	version,
	description,
	TEMP,
	appname: 'sprucebot',
	gitUser: 'sprucelabsai',
	repositories: {
		web: 'com-sprucebot-web',
		api: 'com-sprucebot-api',
		'dev-services': 'sprucebot-dev-services'
	}
}
