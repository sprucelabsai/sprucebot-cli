const path = require('path')
const { spawnSync } = require('child_process')
const chalk = require('chalk')
const hostile = require('hostile')
const inquirer = require('inquirer')

const { isProjectInstalled } = require('../../utils/dir')

async function prompt(options) {
	const prompts = [
		{
			type: 'confirm',
			name: 'loopback',
			message: 'Should I write the loopback?',
			default: true
		},
		{
			type: 'confirm',
			name: 'hosts',
			message: 'Should I write the /etc/hosts entries?',
			default: true
		},
		{
			type: 'confirm',
			name: 'certificate',
			message: 'Should I add the certificate to your Keychain?',
			default: true,
			store: true
		}
	]

	return inquirer.prompt(prompts)
}

async function setupLoopback(installPath) {
	const cwd = path.join(installPath, './dev-services/scripts/loopbackAlias')
	const cmd = spawnSync('sh', ['setupLoopbackAlias.sh'], {
		cwd,
		stdio: 'inherit'
	})

	if (cmd.status !== 0) {
		console.error(cmd.error)
		console.error(
			chalk.bold.red(
				'CRAP! There were problems running the setupLoopbackAlias.sh'
			)
		)
	} else {
		console.log(
			chalk.green('Successfully setup the loopback alias 10.200.10.1 ↫')
		)
	}
}

async function setupHosts(installPath) {
	try {
		const hostsTemplate = path.join(
			installPath,
			'./dev-services/templates/hosts'
		)
		const lines = hostile.getFile(hostsTemplate, false)
		const setLines = hostile.get() // Parse current hosts file
		const missingLines = lines.filter(line => {
			// Determine if hostname is already set for this line
			return setLines.findIndex(l => l[1] === line[1]) === -1
		})
		if (missingLines.length) {
			missingLines.forEach(line => {
				console.log(`Adding host ${line[1]} to your hosts file.`)
				hostile.set(line[0], line[1])
			})
		} else {
			console.log(
				chalk.green('Looks like your hosts file is setup properly. 💪')
			)
		}
	} catch (e) {
		console.error(e)
		if (process.getgid() !== 0) {
			console.error(
				chalk.bold.red(`Uh oh, Writing your hosts file requires 'sudo'`)
			)
		} else {
			console.error(
				chalk.bold.red(
					`Uh oh, I couldn't read your hosts file. Try Googling 'Sprucebot platform hosts'`
				)
			)
		}
	}
}

async function setupCertificates(installPath) {
	const cwd = path.join(installPath, './dev-services/scripts/certificate')
	const cmd = spawnSync('sh', ['setupRootCertificate.sh'], {
		cwd,
		stdio: 'inherit'
	})

	if (cmd.status !== 0) {
		console.error(cmd.error)
		console.error(
			chalk.bold.red(
				'CRAP! There were problems running the setupRootCertificate.sh'
			)
		)
	} else {
		console.log(
			chalk.green(
				'Successfully accepted your root certificate `barbershop.ca.crt`'
			)
		)
	}
}

module.exports = async function configure(
	installPath = process.cwd(),
	options
) {
	console.log('Configuring your environment...')
	if (!isProjectInstalled(installPath)) throw new Error('Halting...')

	const answers = await prompt()

	answers.loopback && (await setupLoopback(installPath))
	answers.hosts && (await setupHosts(installPath))
	answers.certificate && (await setupCertificates(installPath))

	console.log(
		chalk.green(
			'Woot! You development environment looks to be configured correctly.'
		)
	)
	console.log(chalk.green('Start the platform with `sprucebot platform start`'))
}
