const { program } = require('commander');
const CZBankRusher = require('..');
const path = require('path');

program
	.option('-c, --config [path]', 'Config file path', 'config.json')
	.parse(process.argv);

const options = program.opts();
const configFilePath = path.resolve(options.config);

function start(options) {
	const rusher = CZBankRusher(options);

	rusher.start();

	console.log(`Administrator listening on ${rusher.manifest['port.administrator']}.`);
	console.log(`Manager listening on ${rusher.manifest['port.manager']}.`);
	console.log(`Manager-Client running at ${rusher.manifest['manager.origin']}.`);
}

(async function bootstrap() {
	try {
		start(require(configFilePath));
	} catch (err) {
		start({});
	}
}());
