const { Router } = require('@produck/duck-web-koa-router');

module.exports = Router(function CZBRusherPointPlanRouter(router, {
	Model, Resource
}) {
	router.get('/batch', async function getPlanBatchList(ctx) {

	}).post('/batch', async function createPlanBatch() {

	}).get('/preview', async function getPointPreviewList(ctx) {
		const { planId } = ctx.query;

		const list = await Model.CustomerData.findAll({
			include: [
				{
					model: Model.File,
					include: [{ model: Model.Plan, required: true, where: { id: planId } }],
					required: true
				},
				{
					model: Model.Customer,
					include: [{ model: Model.CustomerPoint }]
				},
				{ model: Model.CustomerContribution },
			]
		});

		ctx.body = list
			.filter(preview => Math.round(preview.CustomerContribution.contribution) > 0)
			.map(preview => Resource.PlanBatchPreview(preview));
	});
});
