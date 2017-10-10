const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const yaml = require('js-yaml')

const Generator = require('yeoman-generator')

const { rmdir } = require('../../utils/dir')

module.exports = class extends Generator {
	async initializing() {
		this.sourceRoot(path.join(__dirname, 'templates'))
	}

	async removing() {
		const answers = await this.prompt([
			{
				type: 'confirm',
				name: 'confirm',
				message: `Are you sure you want me to delete ${this.destinationPath()} and all of it's contents?`,
				default: false
			},
			{
				type: 'confirm',
				name: 'confirmHosts',
				message: 'Remove hosts entries?',
				default: false
			},
			{
				type: 'confirm',
				name: 'confirmDocker',
				message: 'Clean docker containers?',
				default: false
			}
		])

		if (answers.confirmHosts) {
			// try {
			//   Configure.Remove.apply(this, [this.options.sudoOverride])
			//   this.log(chalk.green('Bam! Hosts entries removed!'))
			// } catch (e) {
			//   this.log(chalk.bold.red(`Crap, removing host entries failed. ${e.message}.`))
			//   this.log(chalk.bold.yellow('Try running as root.'))
			// }
		}

		if (answers.confirm) {
			const dir = this.destinationPath()
			rmdir(dir)
			this.log(chalk.green(`${dir} removed!`))
		}

		if (answers.confirmDocker) {
			const docker = yaml.safeLoad(
				fs.readFileSync(this.destinationPath('docker-compose.yml'), 'utf8')
			)
			const services = Object.keys(docker.services)
			for (let service of services) {
				this.spawnCommandSync('docker', [
					'rmi',
					docker.services[service].container_name
				])
			}
			this.log(chalk.green('Bam! Removed docker images!'))
		}
	}
}
