const { Router } = require('@produck/duck-web-koa-router');

module.exports = Router(function CZBankRusherManagerDataRouter(router, {
	Sequelize
}) {
	const Model = {
		Manager: Sequelize.model('Manager'),
		ManagerData: Sequelize.model('ManagerData'),
		ManagerContribution: Sequelize.model('ManagerContribution')
	};

	router.get('/', async function getManagerPerformance(ctx) {
		const { managerName, dateAs } = ctx.query;


	});
});
