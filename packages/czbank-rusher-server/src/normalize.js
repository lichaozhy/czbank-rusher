const path = require('path');

module.exports = function normalize(_options = {}) {
	const options = {
		database: {
			rusher: 'czbrusher.sqlite',
			file: 'file'
		},
		workspace: {
			root: path.resolve('public'),
			log: 'log',
			database: 'db'
		}
	};

	const {

	} = _options;

	return options;
};
