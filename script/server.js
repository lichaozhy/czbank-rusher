const CZBRusher = require('../packages/czbank-rusher-server');

const rusher = CZBRusher();
const server = rusher.HttpServer();


server.listen(8080);
// rusher.install();
