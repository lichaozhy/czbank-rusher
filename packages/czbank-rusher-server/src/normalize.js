const path = require('path');

module.exports = function normalize(_options) {
	const options = {
		workspace: {
			root: path.resolve(),
			database: {
				rusher: 'db/czbrusher.sqlite',
				file: 'db/file'
			},
			log: 'log'
		}
	};

	const {
		database: _database = options.database
	} = _options;

	return options;
};
