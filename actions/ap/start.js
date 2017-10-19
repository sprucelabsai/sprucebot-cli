const io = require('socket.io-client')
const chalk = require('chalk')
const keypress = require('keypress')
keypress(process.stdin)

let connection
let controller
const eventData = {
	apId: '6F42B9D0-8160-40C2-B442-95B7F573362F',
	macAddress: 'e0:5:3d:ei:24:f0',
	ipAddress: '192.168.2.95'
}

class Controller {
	constructor(socket) {
		this.socket = socket
	}

	onConnection() {
		console.log(chalk.green('Simulator running...'))
		console.log('enter: ⬆️')
		console.log('leave: ⬇️')
	}

	onError(err) {
		console.log('connection error', err)
	}

	onTimeout() {
		console.log('connection to api dropped')
	}

	onKeyPress(ch, key) {
		if (key.ctrl && key.name === 'c') {
			console.log(chalk.green('Killing simulator...'))
			process.exit()
		} else if (key.name === 'up') {
			this.socket.emit('didEnter', eventData)
		} else if (key.name === 'down') {
			this.socket.emit('didLeave', eventData)
		}
	}
}

module.exports = async function init() {
	if (!connection) {
		connection = io('https://local-api.sprucebot.com', {
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
