const { Router } = require('@produck/duck-web-koa-router');

module.exports = Router(function CZBankRusherManagerDataRouter(router, {
	Sequelize
}) {
	router.get('/', async function getManagerPerformance(ctx) {
		const { managerName, dateAs } = ctx.query;


	});
});
