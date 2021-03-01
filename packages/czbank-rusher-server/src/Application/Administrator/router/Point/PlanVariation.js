const { Router } = require('@produck/duck-web-koa-router');
const { Op } = require('sequelize');

function getDelta(baseData, target) {
	return baseData
		? target.CustomerContribution.contribution - baseData.CustomerContribution.contribution
		: target.CustomerContribution.contribution;
}

module.exports = Router(function CZBRusherPointPlanVariationRouter(router, {
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

	function getFiltered(baseList, targetList) {
		const filtered = [];
		const baseMap = {};

		baseList.forEach(data => baseMap[data.customerId] = data);

		targetList.forEach(data => {
			const baseData = baseMap[data.customerId];
			const delta = getDelta(baseData, data);

			if (delta > 0) {
				filtered.push(data);
				data.delta = delta;
				data.baseContribution = baseData
					? baseData.CustomerContribution.contribution
					: null;
			}
		});

		return filtered;
	}

	router.get('/batch', async function getPlanVariationBatchList(ctx) {
		const list = await Model.PointBatchByPlanVariation.findAll({
			include: [
				{ model: Model.Plan, as: 'basePlan' },
				{ model: Model.Plan, as: 'targetPlan' }
			]
		});

		ctx.body = list.map(batch => Resource.PlanVariationBatch(batch));
	}).post('/batch', async function createPlanVariationBatchList(ctx) {
		const { plan, description } = ctx.request.body;
		const now = new Date();
		const id = Utils.encodeSHA256(`${plan.base.id}-${plan.target.id}-${now.getTime()}`);

		const list = {
			base: await Model.CustomerData.findAll(QueryOptions({ planId: plan.base.id })),
			target: await Model.CustomerData.findAll(QueryOptions({ planId: plan.target.id })),
		};

		const filteredList = getFiltered(list.base, list.target);

		await Model.PointBatchByPlanVariation.create({
			id,
			baseId: plan.base.id,
			targetId: plan.target.id,
			description,
			customerCount: filteredList.length,
			point: filteredList.reduce((sum, current) => sum + current.CustomerContribution.contribution, 0),
			createdAt: now
		});

		const adjustmentList = filteredList.map((adjustment, index) => {
			const nowtime = now.getTime();

			return {
				id: Utils.encodeSHA256(`adjustment-${adjustment.Customer.id}-${index}-${nowtime}`),
				customerId: adjustment.Customer.id,
				value: adjustment.delta,
				type: ADJUSTMENT.TYPE.PLAN_VARIATION,
				createdAt: now
			};
		});

		await Model.CustomerPointAdjustment.bulkCreate(adjustmentList);

		const adjustmentByPlanVariationList = adjustmentList.map(adjustment => {
			return {
				adjustmentId: adjustment.id,
				batchId: id
			};
		});

		await Model.CustomerPointAdjustmentByPlanVariation.bulkCreate(adjustmentByPlanVariationList);

		const pointList = filteredList.map(data => {
			return {
				customerId: data.Customer.id,
				value: data.delta + data.Customer.CustomerPoint.value,
			};
		});

		await Model.CustomerPoint.bulkCreate(pointList, { updateOnDuplicate: ['value'] });

		const batch = await Model.PointBatchByPlanVariation.findOne({
			where: { id },
			include: [
				{ model: Model.Plan, as: 'basePlan' },
				{ model: Model.Plan, as: 'targetPlan' }
			]
		});

		ctx.body = Resource.PlanVariationBatch(batch);
	}).get('/preview', async function getPointPreviewList(ctx) {
		const { basePlanId, targetPlanId } = ctx.query;

		const list = {
			base: await Model.CustomerData.findAll(QueryOptions({ planId: basePlanId})),
			target: await Model.CustomerData.findAll(QueryOptions({ planId: targetPlanId})),
		};

		const filteredList = getFiltered(list.base, list.target);

		ctx.body = filteredList.map(data => Resource.PlanVariationBatchPreview(data));
	});
});
