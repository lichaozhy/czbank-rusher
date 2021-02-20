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
const constant = require('./src/constant');

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
				id: 'rusher.administrator',
				Application: require('./src/Application/Administrator')
			},
			{
				id: 'rusher.manager',
				Application: require('./src/Application/Manager')
			}
		]),
		DuckLog({
			access({ Workspace }) {
				return {
					format: DuckLog.Format.ApacheCLF(),
					AppenderList: [
						DuckLog.Appender.Console(),
						DuckLog.Appender.File({
							file: {
								pathname: Workspace.resolve('log', 'administrator/access.log')
							}
						})
					]
				};
			},
			manager({ Workspace }) {
				return {
					format: DuckLog.Format.ApacheECLF(),
					AppenderList: [
						DuckLog.Appender.Console(),
						DuckLog.Appender.File({
							file: {
								pathname: Workspace.resolve('log', 'manager/access.log')
							}
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
	injection.Constant = constant;

	Log();

	const Application = {
		administrator: Web.Application('rusher.administrator'),
		manager: Web.Application('rusher.manager'),
	};

	const RequestListener = {
		administrator: DuckLog.Adapter.HttpServer(Application.administrator, _ => Log.access(_)),
		manager: DuckLog.Adapter.HttpServer(Application.manager, _ => Log.manager(_))
	};

	return {
		AdministratorHttpServer() {
			return http.createServer(RequestListener.administrator);
		},
		AdministratorHttpsServer() {
			return https.createServer(RequestListener.administrator);
		},
		ManagerHttpServer() {
			return http.createServer(RequestListener.manager);
		},
		ManagerHttpsServer() {
			return https.createServer(RequestListener.manager);
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
