const path = require('path');

module.exports = function normalize(_options) {
	const options = {
		database: {
			path: 'db',
			rusher: 'czbrusher.sqlite',
		},
		workspace: {
			root: path.resolve('public'),
			log: 'log',
			file: 'xls',
			temp: 'temp'
		},
		ticket: {
			timeout: 1 * 60 * 1000
		},
		server: {
			administrator: {
				host: '0.0.0.0',
				port: {
					http: 3000,
					https: 3443
				},
				cert: null
			},
			manager: {
				origin: 'http://127.0.0.1:8000',
				host: '0.0.0.0',
				port: {
					http: 8000,
					https: 8443
				},
				cert: null
			}
		}
	};

	const {
		database: _database = options.database,
		workspace: _workspace = options.workspace,
		server: _server = options.server,
		ticket: _ticket = options.ticket
	} = _options;

	{
		const {
			timeout: _timeout = options.ticket.timeout
		} = _ticket;

		options.ticket.timeout = _timeout;
	}

	{
		const {
			administrator: _administrator = options.server.administrator,
			manager: _manager = options.server.manager
		} = _server;

		{
			const {
				host: _host = options.server.administrator.host,
				port: _port = options.server.administrator.port,
				cert: _cert = options.server.administrator.cert
			} = _administrator;

			{
				const {
					http: _http = options.server.administrator.port.http,
					https: _https = options.server.administrator.port.https
				} = _port;

				options.server.administrator.port.http = _http;
				options.server.administrator.port.https = _https;
			}

			options.server.administrator.host = _host;
			options.server.administrator.cert = _cert;
		}

		{
			const {
				host: _host = options.server.manager.host,
				origin: _origin = options.server.manager.origin,
				port: _port = options.server.manager.port,
				cert: _cert = options.server.manager.cert
			} = _manager;

			{
				const {
					http: _http = options.server.manager.port.http,
					https: _https = options.server.manager.port.https
				} = _port;

				options.server.manager.port.http = _http;
				options.server.manager.port.https = _https;
			}

			options.server.manager.host = _host;
			options.server.manager.origin = _origin;
			options.server.manager.cert = _cert;
		}
	}

	{
		const {
			rusher: _rusher = options.database.rusher,
			path: _path = options.database.path
		} = _database;

		options.database.rusher = _rusher;
		options.database.path = _path;
	}

	{
		const {
			root: _root = options.workspace.root,
			log: _log = options.workspace.log,
			file: _file = options.workspace.file,
			temp: _temp = options.workspace.temp
		} = _workspace;

		options.workspace.root = _root;
		options.workspace.log = _log;
		options.workspace.file = _file;
		options.workspace.temp = _temp;
	}

	return options;
};
