const CZBRusher = require('../packages/czbank-rusher-server');

const rusher = CZBRusher();
const server = rusher.Server();

console.log(server);
