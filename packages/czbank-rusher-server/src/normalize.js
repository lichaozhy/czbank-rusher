const path = require('path');

module.exports = function normalize(_options) {
	const options = {
		database: [
			{
				type: 'sqlite3',
				options: {
					storage: ''
				}
			}
		]
	};

	const {
		database: _database = options.database
	} = _options;

	return options;
};
