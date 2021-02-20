const CZBRusher = require('../packages/czbank-rusher-server');

const rusher = CZBRusher({
	database: {
		onLog: () => {}
	}
});

rusher.AdministratorHttpServer().listen(3000);
rusher.ManagerHttpServer().listen(3001);

console.log('Administrator server running on 3000.');
console.log('Manager server running on 3001.');
