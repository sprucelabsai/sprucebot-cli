module.exports = {
	// Return defaults
	prompt: jest.fn(async prompts =>
		prompts.reduce((obj, p) => {
			switch (p.type) {
				case 'list':
					return {
						...obj,
						[p.name]: p.default || p.choices[0]
					}
				default:
					return {
						...obj,
						[p.name]: p.default
					}
			}
		}, {})
	)
}
