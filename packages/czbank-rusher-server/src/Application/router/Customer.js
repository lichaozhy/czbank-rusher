const { Router } = require('@produck/duck-web-koa-router');

module.exports = Router(function CZBankRusherCustomerRouter(router, {
	Model, Resource
}) {
	router.get('/', function getCustomerList(ctx) {
		const { dateAs } = ctx.query;


	}).get('/performance', async function getCustomerPerformanceRouter(ctx) {
		const { dateAs } = ctx.query;

		if (dateAs === undefined) {
			return ctx.throw(400);
		}

		const list = await Model.CustomerContribution.findAll({
			include: [{
				model: Model.CustomerData,
				required: true,
				include: [
					{ model: Model.Customer },
					{ model: Model.Manager },
					{
						model: Model.File,
						include: [{ model: Model.Plan, where: { dateAs }, required: true }],
						required: true
					}
				]
			}]
		});

		ctx.body = list.map(contribution => Resource.CustomerPerformance(contribution));
	});
});
