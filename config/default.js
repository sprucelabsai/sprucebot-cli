const path = require('path')
const { version, description } = require('../package.json')

const TEMP = path.join(__dirname, '../__TEST__')

module.exports = {
	version,
	description,
	TEMP,
	appname: 'sprucebot',
	gitUser: 'sprucelabsai',
	oldSkillKitPackage: 'sprucebot-skills-kit', // npm module name
	skillKitPackage: '@sprucelabs/sprucebot-skills-kit', // npm module name
	registry: 'https://registry.npmjs.org/',
	platforms: {
		api: {
			repo: {
				name: 'com-sprucebot-api',
				env: './app',
				path: './api'
			},
			pm2: {
				name: 'SB API'
			}
		},
		web: {
			repo: {
				name: 'com-sprucebot-web',
				env: './',
				path: './web'
			},
			pm2: {
				name: 'SB Web'
			}
		},
		dev: {
			repo: {
				name: 'sprucebot-dev-services',
				path: './dev-services',
				env: false
			},
			pm2: {
				name: 'SB Dev Services'
			}
		},
		relay: {
			repo: {
				name: 'sprucebot-relay',
				path: './relay',
				env: false
			},
			pm2: {
				name: 'SB Relay'
			}
		},
		'@sprucelabs/sprucebot-skills-kit': {
			repo: {
				name: 'workspace.sprucebot-skills-kit',
				path: './workspace.sprucebot-skills-kit',
				env: './packages/sprucebot-skills-kit'
			},
			pm2: null
		},
		'sprucebot-cli': {
			repo: {
				name: 'sprucebot-cli',
				path: './sprucebot-cli',
				env: false
			},
			pm2: null
		},
		'teammate-app': {
			repo: {
				name: 'sprucebot-teammate-app',
				path: './teammate-app',
				env: false
			},
			pm2: null
		}
	},
	skillRemotes: [
		{
			label: 'hello.sprucebot.com',
			name: 'prod',
			url: 'https://api.sprucebot.com'
		},
		{
			label: 'alpha-hello.sprucebot.com',
			name: 'alpha',
			url: 'https://alpha-api.sprucebot.com'
		},
		{
			label: 'staging-hello.sprucebot.com',
			name: 'staging',
			url: 'https://staging-api.sprucebot.com'
		},
		{
			label: 'qa-hello.sprucebot.com',
			name: 'qa',
			url: 'https://qa-api.sprucebot.com'
		},
		{
			label: 'dev-hello.sprucebot.com',
			name: 'dev',
			url: 'https://dev-api.sprucebot.com'
		},
		{
			label: 'local.sprucebot.com',
			name: 'local',
			url: 'https://local-api.sprucebot.com',
			allowSelfSignedCerts: true
		}
	],
	skillProps: [
		{
			key: 'NAME',
			name: "Skill's name"
		},
		{
			key: 'SLUG',
			name: "Skill's slug"
		},
		{
			key: 'DESCRIPTION',
			name: 'Describe your skill in 144 characters'
		}
	]
}
