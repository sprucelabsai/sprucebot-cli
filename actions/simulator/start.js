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
	userId: 'EAEF3EC4-D82F-4367-89F3-E8694A7BD3D4',
	locationId: '1975559C-E071-4198-8AB3-ECCBEB00E1D0',
	message: 'You are the best, dewd!'
}

class Controller {
	constructor(socket) {
		this.socket = socket
	}

	onConnection() {
		console.log(chalk.green('Simulator running...'))
		console.log('enter: ⬆️')
		console.log('leave: ⬇️')
		console.log('send message: ➡️')
		console.log('recieve message: ⬅️')
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
