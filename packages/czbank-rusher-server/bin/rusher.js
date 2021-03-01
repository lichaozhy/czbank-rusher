const { program } = require('commander');

const meta = require('../package.json');

program
	.version(meta.version)
	.command('start [options]', 'Starting CZBank Rusher server.')
	.command('install [options]', 'Installing rusher server environment here.')
	.parse(process.argv);
