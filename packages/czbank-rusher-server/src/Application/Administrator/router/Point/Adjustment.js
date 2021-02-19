const { Router } = require('@produck/duck-web-koa-router');

module.exports = Router(function CZBRusherPointAdjustmentRouter(router, {
	Model, Resource, Constant
}) {
	const { ADJUSTMENT } = Constant;
	const mapOfAdjustmentTypeValueToCode = {};

	for (const code in ADJUSTMENT.TYPE) {
		mapOfAdjustmentTypeValueToCode[ADJUSTMENT.TYPE[code]] = code;
	}

	router.get('/', async function getPointAdjustmentList(ctx) {
		const { customerId } = ctx.query;
		const where = {};
		const options = {
			include: [{ model: Model.Customer }],
			where
		};

		if (customerId) {
			where.customerId = customerId;
		}

		const list = await Model.CustomerPointAdjustment.findAll(options);

		list.forEach(data => data.typeCode = mapOfAdjustmentTypeValueToCode[data.type]);
		ctx.body = list.map(data => Resource.PointAdjustment(data));
	});
});
