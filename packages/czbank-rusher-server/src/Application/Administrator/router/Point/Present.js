const { Router } = require('@produck/duck-web-koa-router');

module.exports = Router(function CZBRusherPointPresentRouter(router, {
	Model, Resource, Utils, Constant
}) {
	const { ADJUSTMENT } = Constant;

	router.get('/exchange', async function getPresentExchangeList(ctx) {
		const list = await Model.CustomerPointAdjustmentByPresent.findAll({
			include: [
				{
					model: Model.CustomerPointAdjustment,
					include: [{ model: Model.Customer }]
				},
				{ model: Model.Present }
			]
		});

		ctx.body = list.map(data => Resource.PresentExchange(data));
	}).post('/exchange', async function createPresentExchange(ctx) {
		const body = ctx.request.body;
		const present = await Model.Present.findOne({ where: { id: body.present.id } });

		if (!present) {
			return ctx.throw(400, 'No present.');
		}

		const customerPoint = await Model.CustomerPoint.findOne({
			where: { customerId: body.customer.id }
		});

		if (!customerPoint) {
			return ctx.throw(400, 'No customer');
		}

		const now = new Date();
		const id = Utils.encodeSHA256(`exchange-${now.getTime()}`);
		const delta = present.point * body.amount * -1;

		if (customerPoint.value + delta < 0) {
			return ctx.throw(400, 'No enough point.');
		}

		customerPoint.value += delta;
		await customerPoint.save();

		await Model.CustomerPointAdjustment.create({
			id,
			customerId: customerPoint.customerId,
			value: delta,
			type: ADJUSTMENT.TYPE.PRESENT,
			createdAt: now
		});

		await Model.CustomerPointAdjustmentByPresent.create({
			adjustmentId: id,
			presentId: present.id,
			amount: body.amount,
			description: body.description
		});

		const exchange = await Model.CustomerPointAdjustmentByPresent.findOne({
			where: { adjustmentId: id },
			include: [
				{
					model: Model.CustomerPointAdjustment,
					include: [{ model: Model.Customer }]
				},
				{ model: Model.Present }
			]
		});

		ctx.body = Resource.PresentExchange(exchange);
	});
});
