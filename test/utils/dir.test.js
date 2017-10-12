/* eslint-env jest */
const fs = require('fs')
const path = require('path')
const config = require('config')

const {
	rmdir,
	createDir,
	directoryExists,
	fileExists,
	isProjectInstalled
} = require('../../utils/dir')

const TEMP = config.get('TEMP')

describe('Directory Utility Functions', () => {
	afterAll(() => {
		rmdir(TEMP)
	})
	test('creates a directory', () => {
		const dir = path.join(TEMP, 'create')
		createDir(dir)
		const stats = fs.statSync(dir)
		expect(stats.isDirectory()).toBeTruthy()
	})
	test('deletes a directory', () => {
		const dir = path.join(TEMP, 'delete')
		createDir(dir)
		rmdir(dir)
		try {
			fs.statSync(dir)
			expect(true, 'statSync should have thrown error ').toBeFalsy()
		} catch (e) {
			expect(e.message).toContain('ENOENT')
		}
	})
	test('checks if directory exists', () => {
		const dir = path.join(TEMP, 'check')
		let exists = directoryExists(dir)
		expect(exists).toBeFalsy()
		createDir(dir)
		exists = directoryExists(dir)
		expect(exists).toBeTruthy()
	})
	test('checks if file exists', () => {
		const file = path.join(TEMP, 'file.txt')
		expect(fileExists(file)).toBeFalsy()
		fs.writeFileSync(file, 'Hello World!')
		expect(fileExists(file)).toBeTruthy()
	})
	describe('checks if project is installed', () => {
		test('it returns false', () => {
			expect(isProjectInstalled(TEMP)).toBeFalsy()
		})
		test('it returns true', () => {
			fs.writeFileSync(path.join(TEMP, 'ecosystem.config.js'))
			expect(isProjectInstalled(TEMP)).toBeTruthy()
		})
	})
})
