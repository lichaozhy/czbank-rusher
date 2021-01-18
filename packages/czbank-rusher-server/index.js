const Duck = require('@produck/duck');
const DuckWeb = require('@produck/duck-web');
const DuckLog = require('@produck/duck-log');
const DuckWorkspace = require('./lib/workspace');
const http = require('http');
const https = require('https');

const meta = require('./package.json');
const normlize = require('./src/normalize');
const RusherSequelize = require('./src/sequelize');

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
			access: {
				format: DuckLog.Format.ApacheCLF(),
				AppenderList: [
					DuckLog.Appender.Console(),
					// DuckLog.Appender.File()
				]
			},
		})
	]
}, async function CZBankRusher({
	injection, Log, Web, Workspace, product
}, options) {
	const finalOption = normlize(options);
	const sequelize = RusherSequelize({
		namespace: product.meta.namespace
	});

	injection.Sequelize = sequelize;
	injection.options = finalOption;

	Log();

	const app = Web.Application('rusher');
	const requestListener =  DuckLog.Adapter.HttpServer(app, _ => Log.access(_));

	await Workspace.buildAll();

	return {
		Server() {
			const server = {
				http: http.createServer(requestListener),
				https: https.createServer(requestListener)
			}

			return server;
		}
	}
});
