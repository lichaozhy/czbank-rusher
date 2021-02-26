const { program } = require('commander');

const CZBankPusher = require('..');
const meta = require('../package.json');

program
	.version(meta.version)
	.option('-h, --host <host>', 'Setting the server host to listen on.', '0.0.0.0')
	.option('-p, --port <port>', 'Setting the server port to listen on.', 8080)
	.parse(process.argv);

const options = program.opts();

const rusher = CZBankPusher({});

rusher.AdministratorHttpServer().listen(3000);
rusher.ManagerHttpServer().listen(3001);

console.log('Administrator server running on 3000.');
console.log('Manager server running on 3001.');
