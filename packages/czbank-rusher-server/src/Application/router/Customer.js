const { Router } = require('@produck/duck-web-koa-router');

module.exports = Router(function CZBankRusherCustomerRouter(router, {
	Sequelize
}) {
	const Customer = Sequelize.model('Customer');

	router.get('/', function getCustomerList(ctx) {
		const { dateAs } = ctx.query;


	});
});
