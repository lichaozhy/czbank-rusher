const { Router } = require('@produck/duck-web-koa-router');

module.exports = Router(function CZBankRusherCustomerRouter(router, {
	Model, Resource
}) {
	router.get('/', function getCustomerList(ctx) {
		const { dateAs } = ctx.query;


	}).get('/performance', async function getCustomerPerformanceRouter(ctx) {
		const { dateAs, customerId } = ctx.query;

		const list = await Model.CustomerContribution.findAll({
			include: [{
				model: Model.CustomerData,
				required: true,
				include: [
					{
						model: Model.Customer,
						where: customerId ? { id: customerId } : {},
						required: true
					},
					{ model: Model.Manager },
					{
						model: Model.File,
						include: [{
							model: Model.Plan,
							where: dateAs ? { dateAs } : {},
							required: true
						}],
						required: true
					}
				]
			}]
		});

		ctx.body = list.map(contribution => Resource.CustomerPerformance(contribution));
	});
});
