const CZBRusher = require('../packages/czbank-rusher-server');
const config = require('./config.json');

const rusher = CZBRusher({
	database: {
		onLog: () => {}
	},
	server: {
		administrator: {
			port: {
				http: 3000
			}
		},
		manager: {
			origin: config.managerOrigin,
			port: {
				http: 3001
			}
		}
	}
});

rusher.AdministratorHttpServer().listen(3000);
rusher.ManagerHttpServer().listen(3001);

rusher.start()

console.log('Administrator server running on 3000.');
console.log('Manager server running on 3001.');
