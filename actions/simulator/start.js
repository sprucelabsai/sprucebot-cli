const chalk = require('chalk')
const log = require('../../utils/log')
const readline = require('readline')
const skillUtil = require('../../utils/skill')
const configUtil = require('../../utils/config')
const requestUtil = require('../../utils/request')
const inquirer = require('inquirer')

let controller

class Controller {
	constructor({ endpoint, location, user, skill }) {
		this.endpoint = endpoint
		this.location = location
		this.user = user
		this.skill = skill
		this.listeningToKeyPress = true
		this.lastMessage

		requestUtil.auth(user)
	}

	start() {
		readline.emitKeypressEvents(process.stdin)
		process.stdin.on('keypress', this.onKeyPress.bind(this))
		process.stdin.setRawMode(true)
		process.stdin.resume()
		log.success('Simulator running...')

		this.drawMenu()
	}

	drawMenu() {
		log.line('enter: ⬆️')
		log.line('leave: ⬇️')
		log.line('send message: ➡️')
		log.line('receive message: ⬅️')
	}

	async onKeyPress(ch, key) {
		if (key && this.listeningToKeyPress) {
			try {
				if (key.ctrl && key.name === 'c') {
					console.log(chalk.green('Killing simulator...'))
					process.exit()
				} else if (key.name === 'up') {
					await this._emit('did-enter')
				} else if (key.name === 'down') {
					await this._emit('did-leave')
				} else if (key.name === 'right') {
					await this.sendMessage()
				} else if (key.name == 'left') {
					await this.receiveMessage()
				}
			} catch (err) {
				log.error(err.friendlyMessage || err.message)
			}
		}
	}

	async sendMessage() {
		this.listeningToKeyPress = false
		const answer = await inquirer.prompt({
			type: 'input',
			message: 'Message to send',
			name: 'message',
			default: this.lastMessage
		})
		this.lastMessage = answer.message
		this.listeningToKeyPress = true
		await process.stdin.setRawMode(true)
		process.stdin.resume()
		this.drawMenu()

		await this._emit('did-message', { message: this.lastMessage })
	}

	async _emit(eventName, data = {}) {
		await requestUtil.post(
			`/dev/${this.location.id}/skill/${this.skill.id}/emit/${eventName}`,
			data
		)
	}
}

module.exports = async function init() {
	controller = new Controller({
		endpoint: skillUtil.readEnv('API_HOST'),
		location: configUtil.location(),
		user: configUtil.user(),
		skill: skillUtil.skill()
	})
	controller.start()
}
