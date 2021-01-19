const CZBRusher = require('../packages/czbank-rusher-server');

const rusher = CZBRusher();
const server = rusher.HttpServer();


server.listen(3000);
// rusher.install();
