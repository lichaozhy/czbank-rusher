const path = require('path');

module.exports = function normalize(_options = {}) {
	const options = {
		database: {
			rusher: 'czbrusher.sqlite',
			file: 'file',
			onLog: _ => console.log(_)
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
