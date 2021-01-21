const Duck = require('@produck/duck');
const DuckWeb = require('@produck/duck-web');
const DuckLog = require('@produck/duck-log');
const DuckWorkspace = require('./lib/workspace');
const http = require('http');
const https = require('https');

const meta = require('./package.json');
const normlize = require('./src/normalize');
const RusherSequelize = require('./src/sequelize');
const utils = require('./src/utils');
const AccountDataResolver = require('./src/AccountDataResolver');

module.exports = Duck({
	id: 'com.czbank.tianjin.rusher',
	name: meta.name,
	version: meta.version,
	namespace: 'czbr',
	description: meta.description,
	components: [
		DuckWorkspace(),
		DuckWeb([
			{
				id: 'rusher',
				Application: require('./src/Application')
			}
		]),
		DuckLog({
			access({ Workspace }) {
				return {
					format: DuckLog.Format.ApacheCLF(),
					AppenderList: [
						DuckLog.Appender.Console(),
						DuckLog.Appender.File({
							file: { pathname: Workspace.resolve('log', 'access.log') }
						})
					]
				};
			},
			DB: {
				label: 'DB'
			}
		})
	]
}, function CZBankRusher({
	injection, Log, Web, Workspace, product
}, options) {
	injection.Utils = utils;
	injection.AccountDataResolver = AccountDataResolver;

	const finalOption = normlize(options);

	Workspace.root = finalOption.workspace.root;
	Workspace.setPath('database', finalOption.workspace.database);
	Workspace.setPath('log', finalOption.workspace.log);

	const sequelize = RusherSequelize({
		namespace: `${product.meta.namespace}_`,
		storage: Workspace.resolve('database', finalOption.database.rusher),
		onLog: message => Log.DB(message)
	});

	injection.Sequelize = sequelize;
	injection.options = finalOption;

	Log();

	const app = Web.Application('rusher');
	const requestListener =  DuckLog.Adapter.HttpServer(app, _ => Log.access(_));

	return {
		HttpServer() {
			return http.createServer(requestListener);
		},
		HttpsServer() {
			return https.createServer(requestListener);
		},
		async install(options) {
			await Workspace.buildAll();
			await sequelize.sync();
		}
	};
});
