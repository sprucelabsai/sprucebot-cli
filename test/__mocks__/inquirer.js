module.exports = {
	// Return defaults
	prompt: jest.fn(async prompts =>
		prompts.reduce((obj, p) => {
			return {
				...obj,
				[p.name]: p.default
			}
		}, {})
	)
}
