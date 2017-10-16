let _setHosts = []
let _setFile = []

module.exports = {
	get: jest.fn((formatting, cb) => {
		const lines = _setHosts
		cb && cb(null, lines)
		return lines
	}),
	getFile: jest.fn(() => _setFile),
	set: jest.fn(),

	_setHosts: jest.fn(lines => (_setHosts = lines)),
	_setFileHosts: jest.fn(lines => (_setFile = lines))
}
