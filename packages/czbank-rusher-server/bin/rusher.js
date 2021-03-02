const meta = require('../package.json');
const CZBankRusher = require('..');
const path = require('path');
const PRODUCT_LIST = require('./product');
const fs = require('fs').promises;
const utils = require('../src/utils');

function start(options) {
	const rusher = CZBankRusher(options);

	rusher.start();

	console.log(`Administrator listening on ${rusher.manifest['port.administrator']}.`);
	console.log(`Manager listening on ${rusher.manifest['port.manager']}.`);
	console.log(`Manager-Client running at ${rusher.manifest['manager.origin']}.`);
}

async function install(options) {
	await fs.rmdir(path.resolve('public'), { recursive: true });

	const rusher = CZBankRusher(options);
	const Product = rusher.sequelize.model('Product');
	const ProductDataSetting = rusher.sequelize.model('ProductDataSetting');

	await rusher.install();

	PRODUCT_LIST.forEach(options => {
		const { name, code, balanceIndex, averageIndex } = options;
		const id = utils.encodeSHA256(`${name}${code}${Date.now()}`);

		Product.create({ id, name, code, description: name });

		ProductDataSetting.create({
			productId: id,
			fieldIndexOfAverage: averageIndex,
			fieldIndexOfBalance: balanceIndex
		});
	});
}

require('yargs/yargs')(process.argv.slice(2))
	.command('start [options]', 'Starting CZBank Rusher server.', {
		config: { alias: 'c', default: 'config.json' }
	}, argv => {
		const configFilePath = path.resolve(argv.config);

		try {
			start(require(configFilePath));
		} catch (err) {
			start({});
		}
	})
	.command('install [options]', 'Installing rusher server environment here.', {
		config: { alias: 'c', default: 'config.json' }
	}, argv => {
		const configFilePath = path.resolve(argv.config);

		try {
			install(require(configFilePath));
		} catch (err) {
			install({});
		}
	})
	.help()
	.version(meta.version)
	.argv;
