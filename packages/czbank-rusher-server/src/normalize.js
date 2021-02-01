const path = require('path');

module.exports = function normalize(_options = {}) {
	const options = {
		database: {
			rusher: 'czbrusher.sqlite',
			file: 'file',
		},
		workspace: {
			root: path.resolve('public'),
			log: 'log',
			database: 'db',
			file: 'xls',
			temp: 'temp'
		}
	};

	const {
		database: _database = options.database,
		workspace: _workspace = options.workspace
	} = _options;

	{
		const {
			rusher: _rusher = options.database.rusher,
			file: _file = options.database.file
		} = _database;

		options.database.rusher = _rusher;
		options.database.file = _file;
	}

	{
		const {
			root: _root = options.workspace.root,
			log: _log = options.workspace.log,
			database: _database = options.workspace.database,
			file: _file = options.workspace.file,
			temp: _temp = options.workspace.temp
		} = _workspace;

		options.workspace.root = _root;
		options.workspace.log = _log;
		options.workspace.database = _database;
		options.workspace.file = _file;
		options.workspace.temp = _temp;
	}

	return options;
};
