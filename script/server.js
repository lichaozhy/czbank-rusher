const CZBRusher = require('../packages/czbank-rusher-server');

const rusher = CZBRusher({
	database: {
		onLog: () => {}
	}
});
const server = rusher.HttpServer();


server.listen(3000);
// rusher.install();
