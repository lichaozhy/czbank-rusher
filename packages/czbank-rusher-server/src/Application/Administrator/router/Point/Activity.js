const { Router } = require('@produck/duck-web-koa-router');

module.exports = Router(function CZBRusherPointActivityRouter(router, {
	Model, Resource, Utils, Constant
}) {
	const { ADJUSTMENT } = Constant;

	router.get('/reward', async function getActivityReward(ctx) {
		const list = await Model.CustomerPointAdjustmentByActivity.findAll({
			include: [
				{
					model: Model.CustomerPointAdjustment,
					include: [{ model: Model.Customer }]
				},
				{ model: Model.Activity }
			]
		});

		ctx.body = list.map(data => Resource.ActivityReward(data));
	}).post('/reward', async function createActivityReward(ctx) {
		const body = ctx.request.body;

		const activity = await Model.Activity.findOne({
			where: { id: body.activity.id }
		});

		if (!activity) {
			return ctx.throw(400, 'No activity');
		}

		const customerPoint = await Model.CustomerPoint.findOne({
			where: { customerId: body.customer.id }
		});

		if (!customerPoint) {
			return ctx.throw(400, 'No customer');
		}

		const now = new Date();
		const id = Utils.encodeSHA256(`reward-${now.getTime()}`);

		customerPoint.value += body.point;
		await customerPoint.save();

		await Model.CustomerPointAdjustment.create({
			id,
			customerId: customerPoint.customerId,
			value: body.point,
			type: ADJUSTMENT.TYPE.ACTIVITY,
			createdAt:  now
		});

		await Model.CustomerPointAdjustmentByActivity.create({
			adjustmentId: id,
			activityId: activity.id,
			description: body.description
		});

		const reward = await Model.CustomerPointAdjustmentByActivity.findOne({
			where: { adjustmentId: id },
			include: [
				{
					model: Model.CustomerPointAdjustment,
					include: [{ model: Model.Customer }]
				},
				{ model: Model.Activity }
			]
		});

		ctx.body = Resource.ActivityReward(reward);
	});
});
