const io = require('socket.io-client')
const chalk = require('chalk')
const keypress = require('keypress')
keypress(process.stdin)

let connection
let controller
const endpoint = process.env.API_URL || 'https://local-api.sprucebot.com'

// Defaulting to Taylor's info for now.
const enterExitEventData = {
	apId: '6F42B9D0-8160-40C2-B442-95B7F573362F',
	macAddress: 'e0:5:3d:ei:24:f0',
	ipAddress: '192.168.2.95',
	force: true
}

const simulateSendMessageEventData = {
	userId: '78245981-5022-49A7-B2F2-6AC687E0F3D1',
	locationId: '1975559C-E071-4198-8AB3-ECCBEB00E1D0',
	message: 'You are the best, dewd!'
}

const simulateReceiveMessageEventData = {
	body: {
		ToCountry: 'US',
		ToState: 'CO',
		SmsMessageSid: 'SM69c4156c31def95b59856ccbfdf2e40b',
		NumMedia: '0',
		ToCity: 'DENVER',
		FromZip: '80104',
		SmsSid: 'SM69c4156c31def95b59856ccbfdf2e40b',
		FromState: 'CO',
		SmsStatus: 'received',
		FromCity: 'DENVER',
		Body: 'hey there dude!',
		FromCountry: 'US',
		To: '+17204631406',
		MessagingServiceSid: 'MG655c76664a59df723580f8b4288d9600',
		ToZip: '80202',
		NumSegments: '1',
		MessageSid: 'SM69c4156c31def95b59856ccbfdf2e40b',
		AccountSid: 'AC036cf2da1f4be9b4063e64939327acdb',
		From: '+17202535250',
		ApiVersion: '2010-04-01'
	}
}

class Controller {
	constructor(socket) {
		this.socket = socket
		this.firstRun = true
	}

	onConnection() {
		console.log(
			chalk.green(
				this.firstRun ? 'Simulator running...' : 'Simulator recovered'
			)
		)
		console.log('enter: ⬆️')
		console.log('leave: ⬇️')
		console.log('send message: ➡️')
		console.log('receive message: ⬅️')

		this.firstRun = false
	}

	onError(err) {
		console.log(chalk.bold.red('connection error'), err)
	}

	onTimeout() {
		console.log(chalk.bold.red('Connection to backend lost.'))
	}

	onKeyPress(ch, key) {
		if (key.ctrl && key.name === 'c') {
			console.log(chalk.green('Killing simulator...'))
			process.exit()
		} else if (key.name === 'up') {
			this.socket.emit('didEnter', enterExitEventData)
		} else if (key.name === 'down') {
			this.socket.emit('didLeave', enterExitEventData)
		} else if (key.name === 'right') {
			this.socket.emit('simulateSendMessage', simulateSendMessageEventData)
		} else if (key.name == 'left') {
			this.socket.emit(
				'simulateReceiveMessage',
				simulateReceiveMessageEventData
			)
		}
	}
}

module.exports = async function init() {
	if (!connection) {
		console.log(chalk.green(`Establishing connection to ${endpoint}`))
		connection = io(endpoint, {
			path: '/ws',
			transports: ['websocket'],
			rejectUnauthorized: false
		})
		controller = new Controller(connection)
		connection.on('connect', controller.onConnection.bind(controller))
		connection.on('error', controller.onError.bind(controller))
		connection.on('connect_timeout', controller.onTimeout.bind(controller))
	}

	process.stdin.on('keypress', controller.onKeyPress.bind(controller))

	process.stdin.setRawMode(true)
	process.stdin.resume()
}
