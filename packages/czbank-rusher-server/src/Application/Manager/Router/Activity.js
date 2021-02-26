const { Router } = require('@produck/duck-web-koa-router');

module.exports = Router(function CZBankManagerActivity(router, {
	Model, AccessControl: $AC, Utils, Constant
}) {
	const { ADJUSTMENT } = Constant;

	function Activity(data) {
		return {
			id: data.id,
			name: data.name,
			startedAt: data.startedAt,
			endedAt: data.endedAt,
			description: data.description,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt
		};
	}

	function ActivityReward(data) {
		const exchange = data;
		const { CustomerPointAdjustment: adjustment } = exchange;
		const { Customer: customer } = adjustment;

		return {
			id: data.adjustmentId,
			activityId: data.activityId,
			customerId: customer.id,
			point: data.point,
			description: data.description,
			createdAt: data.createdAt
		}
	}

	router.get('/', $AC('activity.query'), async ctx => {
		const now = new Date();
		const list = await Model.Activity.findAll();

		ctx.body = list.filter(activity => {
			const { startedAt, endedAt } = activity;

			return startedAt < now && (now < endedAt || endedAt === null);
		}).map(activity => Activity(activity));
	}).get('/:activityId', $AC('activity.get'), async ctx => {

	}).post('/reward', $AC('activity.reward'), async ctx => {
		const { activityId, customerId, point, description } = ctx.request.body;
		const activity = await Model.Activity.findOne({
			where: { id: activityId }
		});

		if (!activity) {
			return ctx.throw(400, 'No activity');
		}

		const customerPoint = await Model.CustomerPoint.findOne({ where: { customerId } });

		if (!customerPoint) {
			return ctx.throw(400, 'No customer');
		}

		const now = new Date();
		const id = Utils.encodeSHA256(`reward-${now.getTime()}`);

		customerPoint.value += point;
		await customerPoint.save();

		await Model.CustomerPointAdjustment.create({
			id,
			customerId: customerPoint.customerId,
			value: point,
			type: ADJUSTMENT.TYPE.ACTIVITY,
			createdAt:  now
		});

		await Model.CustomerPointAdjustmentByActivity.create({
			adjustmentId: id,
			activityId: activity.id,
			description: description
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

		ctx.body = ActivityReward(reward);
	});
});
