const { Router } = require('@produck/duck-web-koa-router');

module.exports = Router(function CZBankManagerPresent(router, {
	Model, AccessControl: $AC, Utils, Constant
}) {
	const { ADJUSTMENT } = Constant;

	function Present(data) {
		return {
			id: data.id,
			name: data.name,
			price: data.price,
			point: data.point,
			description: data.description,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt
		};
	}

	function PresentExchange(data) {
		const exchange = data;
		const { CustomerPointAdjustment: adjustment } = exchange;
		const { Customer: customer } = adjustment;

		return {
			id: data.adjustmentId,
			presentId: data.presentId,
			customerId: customer.id,
			amount: data.amount,
			description: data.description,
			createdAt: exchange.createdAt
		};
	}

	router.get('/', $AC('present.query'), async ctx => {
		const list = await Model.Present.findAll({ where: { enabled: true } });

		ctx.body = list.map(data => Present(data));
	}).get('/:presentId', $AC('present.get'), async ctx => {

	}).post('/exchange', $AC('present.exchange'), async ctx => {
		const { presentId, customerId, amount, description } = ctx.request.body;
		const present = await Model.Present.findOne({ where: { id: presentId } });

		if (!present) {
			return ctx.throw(400, 'No present.');
		}

		const customerPoint = await Model.CustomerPoint.findOne({ where: { customerId } });

		if (!customerPoint) {
			return ctx.throw(400, 'No customer');
		}

		const now = new Date();
		const id = Utils.encodeSHA256(`exchange-${now.getTime()}`);
		const delta = present.point * amount * -1;

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
			amount: amount,
			description: description
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

		ctx.body = PresentExchange(exchange);
	});
});
