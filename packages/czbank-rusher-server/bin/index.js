const { program } = require('commander');

const CZBankPusher = require('../');
const meta = require('../package.json');

program
	.version(meta.version)


const pusher = CZBankPusher();
