const path = require('path')
const { version, description } = require('../package.json')

const TEMP = path.join(__dirname, '../__TEST__')

module.exports = {
	version,
	description,
	TEMP,
	appname: 'sprucebot',
	gitUser: 'sprucelabsai',
	skillKitPackage: '@sprucelabs/spruce-skill', // npm module name
	registry: 'https://registry.npmjs.org/',
	platforms: {
		api: {
			repo: {
				name: 'com-sprucebot-api',
				env: './src',
				path: './api',
				coredev: true
			},
			pm2: {
				name: 'SB API'
			}
		},
		web: {
			repo: {
				name: 'com-sprucebot-web',
				env: './',
				path: './web',
				coredev: true
			},
			pm2: {
				name: 'SB Web'
			}
		},
		dev: {
			repo: {
				name: 'sprucebot-dev-services',
				path: './dev-services',
				env: false,
				coredev: true
			},
			pm2: {
				name: 'SB Dev Services'
			}
		},
		relay: {
			repo: {
				name: 'sprucebot-relay',
				path: './relay',
				env: false,
				coredev: false
			},
			pm2: {
				name: 'SB Relay'
			}
		},
		'@sprucelabs/sprucebot-skills-kit': {
			repo: {
				name: 'workspace.sprucebot-skills-kit',
				path: './workspace.sprucebot-skills-kit',
				env: './packages/sprucebot-skills-kit',
				coredev: false
			},
			pm2: null
		},
		'sprucebot-cli': {
			repo: {
				name: 'sprucebot-cli',
				path: './sprucebot-cli',
				env: false,
				coredev: false
			},
			pm2: null
		},
		'teammate-app': {
			repo: {
				name: 'sprucebot-teammate-app',
				path: './teammate-app',
				env: false,
				coredev: false
			},
			pm2: null
		}
	},
	skillRemotes: [
		{
			label: 'platform.spruce.ai',
			name: 'prod',
			web: 'https://platform.spruce.ai',
			url: 'https://api.spruce.ai'
		},
		{
			label: 'alpha.platform.spruce.ai',
			name: 'alpha',
			web: 'https://alpha.platform.spruce.ai',
			url: 'https://alpha-api.spruce.ai'
		},
		{
			label: 'staging.platform.spruce.ai',
			name: 'staging',
			web: 'https://staging.platform.spruce.ai',
			url: 'https://staging-api.spruce.ai'
		},
		{
			label: 'qa.platform.spruce.ai',
			name: 'qa',
			web: 'https://qa.platform.spruce.ai',
			url: 'https://qa-api.spruce.ai'
		},
		{
			label: 'dev.platform.spruce.ai',
			name: 'dev',
			web: 'https://dev.platform.spruce.ai',
			url: 'https://dev-api.spruce.ai'
		},
		{
			label: 'local.platform.spruce.ai',
			name: 'local',
			web: 'https://local.platform.spruce.ai',
			url: 'https://local-api.spruce.ai',
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
