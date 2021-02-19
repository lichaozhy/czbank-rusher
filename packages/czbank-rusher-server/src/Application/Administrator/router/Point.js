const { Router } = require('@produck/duck-web-koa-router');
const { Op } = require('sequelize');

module.exports = Router(function CZBRusherPointRouter(router, {
	Model, Resource
}) {
	router.get('/', async function getCustomerPointList(ctx) {
		const list = await Model.Customer.findAll({
			include: [{
				model: Model.CustomerPoint
			}]
		});

		ctx.body = list.map(data => Resource.CustomerPoint(data));
	});
});
