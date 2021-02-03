const Duck = require('@produck/duck');
const DuckWeb = require('@produck/duck-web');
const DuckLog = require('@produck/duck-log');
const DuckWorkspace = require('@produck/duck-workspace');
const http = require('http');
const https = require('https');

const meta = require('./package.json');
const normlize = require('./src/normalize');
const RusherSequelize = require('./src/sequelize');
const utils = require('./src/utils');
const ReportResolver = require('./src/ReportResolver');

require('sqlite3');

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
	injection.ReportResolver = ReportResolver;

	const finalOptions = normlize(options);

	Workspace.root = finalOptions.workspace.root;
	Workspace.setPath('database', finalOptions.workspace.database);
	Workspace.setPath('log', finalOptions.workspace.log);
	Workspace.setPath('file', finalOptions.workspace.file);
	Workspace.setPath('temp', finalOptions.workspace.temp);

	const { sequelize, Model } = RusherSequelize({
		namespace: `${product.meta.namespace}_`,
		storage: Workspace.resolve('database', finalOptions.database.rusher),
		onLog: () => {}
	});

	injection.Sequelize = sequelize;
	injection.Model = Model;
	injection.options = finalOptions;

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
			await sequelize.sync({ force: true });
		},
		get sequelize() {
			return sequelize;
		}
	};
});
