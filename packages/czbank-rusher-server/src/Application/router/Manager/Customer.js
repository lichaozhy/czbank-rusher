const { Router } = require('@produck/duck-web-koa-router');

module.exports = Router(function CZBankRusherManagerFileRouter(router, {
	Resource, Model
}) {
	router.get('/performance', async function getCustomerPerformanceList(ctx) {
		const { manager } = ctx.state;
		const { dateAs } = ctx.query;

		const list = await Model.CustomerData.findAll({
			where: { managerId: manager.id },
			include: [
				Model.CustomerContribution,
				Model.Customer,
				{
					model: Model.File,
					include: [{ model: Model.Plan, where: { dateAs } }],
					required: true
				}
			],
		});

		ctx.body = list.map(customerData => Resource.CustomerPerformance(customerData));
	}).get('/contribution', async function getCustomerContributionList(ctx) {
		const { manager } = ctx.state;
		const { dateAs } = ctx.query;

		const list = await Model.CustomerData.findAll({
			attributes: [],
			where: { managerId: manager.id },
			include: [
				{
					model: Model.CustomerContribution,
					attributes: ['contribution']
				},
				{
					attributes: [],
					model: Model.File,
					include: [{ model: Model.Plan, where: { dateAs } }],
					required: true
				}
			],
		});

		ctx.body = list.map(data => data.CustomerContribution.contribution);
	});
});
