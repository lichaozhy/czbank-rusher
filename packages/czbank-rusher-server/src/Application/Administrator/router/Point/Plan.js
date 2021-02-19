const { Router } = require('@produck/duck-web-koa-router');
const { Op } = require('sequelize');

module.exports = Router(function CZBRusherPointPlanRouter(router, {
	Model, Resource, Utils, Constant
}) {
	const { ADJUSTMENT } = Constant;

	function QueryOptions({ planId }) {
		return {
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
				{
					model: Model.CustomerContribution,
					where: { contribution: { [Op.gt]: 0 } },
					require: true
				},
			]
		};
	}

	router.get('/batch', async function getPlanBatchList(ctx) {
		const list = await Model.PointBatchByPlan.findAll({
			include: [Model.Plan]
		});

		ctx.body = list.map(batch => Resource.PlanBatch(batch));
	}).post('/batch', async function createPlanBatch(ctx) {
		const { planId, description } = ctx.request.body;
		const now = new Date();
		const id = Utils.encodeSHA256(`${planId}-${now.getTime()}`);
		const list = await Model.CustomerData.findAll(QueryOptions({ planId }));

		// create `PointBatchByPlan`
		const abstract = {
			customerCount: list.length,
			point: list.reduce((sum, current) => sum + current.CustomerContribution.contribution, 0),
		};

		await Model.PointBatchByPlan.create({
			id, planId, description,
			pending: true,
			customerCount: abstract.customerCount,
			point: abstract.point,
			createdAt: now
		});

		const adjustmentList = list.map((preview, index) => {
			const nowtime = now.getTime();

			return {
				id: Utils.encodeSHA256(`adjustment-${preview.Customer.id}-${index}-${nowtime}`),
				customerId: preview.Customer.id,
				value: preview.CustomerContribution.contribution,
				type: ADJUSTMENT.TYPE.PLAN,
				createdAt: now
			};
		});

		await Model.CustomerPointAdjustment.bulkCreate(adjustmentList);

		const adjustmentByPlanList = adjustmentList.map(adjustment => {
			return {
				adjustmentId: adjustment.id,
				batchId: id
			};
		});

		await Model.CustomerPointAdjustmentByPlan.bulkCreate(adjustmentByPlanList);

		const pointList = list.map(preview => {
			return {
				customerId: preview.Customer.id,
				value: preview.CustomerContribution.contribution +
					preview.Customer.CustomerPoint.value,
			};
		});

		await Model.CustomerPoint.bulkCreate(pointList, { updateOnDuplicate: ['value'] });

		const batch = await Model.PointBatchByPlan.findOne({
			where: { id },
			include: [Model.Plan]
		});

		ctx.body = Resource.PlanBatch(batch);
	}).get('/preview', async function getPointPreviewList(ctx) {
		const { planId } = ctx.query;
		const list = await Model.CustomerData.findAll(QueryOptions({ planId }));

		ctx.body = list.map(preview => Resource.PlanBatchPreview(preview));
	});
});
