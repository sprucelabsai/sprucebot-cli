const request = require('request')
const configUtil = require('./config')

exports.endpoint = env => {
	return configUtil.remote().url + '/api/1.0'
}

exports.auth = user => {
	this.user = user
}

exports.headers = () => {
	if (this.user) {
		return {
			Authorization: `JWT ${this.user.jwt}`
		}
	}

	return {}
}

exports.post = async (path, data) => {
	const uri = this.endpoint() + path

	return await new Promise((accept, reject) => {
		request(
			{
				method: 'POST',
				uri: uri,
				json: data,
				headers: this.headers(),
				agentOptions: {
					rejectUnauthorized: !configUtil.remote().allowSelfSignedCerts
				}
			},
			(err, response, body) => {
				if (err) {
					reject(err)
					return
				}
				try {
					if (response.statusCode === 200) {
						accept(body)
					} else {
						reject(new Error(body.friendlyReason))
					}
				} catch (err) {
					reject(new Error('Invalid response from Sprucebot.'))
				}
			}
		)
	})
}

exports.get = async (path, options) => {
	const uri = this.endpoint() + path

	return await new Promise((accept, reject) => {
		request.get(
			{
				url: uri,
				headers: this.headers(),
				agentOptions: {
					rejectUnauthorized: !configUtil.remote().allowSelfSignedCerts
				}
			},
			(err, response, body) => {
				if (err) {
					reject(err)
					return
				}
				try {
					const json = JSON.parse(body)
					if (response.statusCode === 200) {
						accept(json)
					} else {
						reject(new Error(json.friendlyReason))
					}
				} catch (err) {
					reject(new Error('Invalid response from Sprucebot.'))
				}
			}
		)
	})
}
