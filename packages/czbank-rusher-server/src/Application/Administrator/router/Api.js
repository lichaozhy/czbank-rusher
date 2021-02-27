const { Router } = require('@produck/duck-web-koa-router');

module.exports = Router(function CZBankRusherAPIRouter(router, {
	product, options, Model, Ticket
}) {
	router.get('/meta', function getServiceMeta(ctx) {
		ctx.body = product;
	}).get('/meta/manager', function getManagerServiceMeta(ctx) {
		ctx.body = {
			origin: options.server.manager.origin,
			path: '/api/principal/'
		};
	}).post('/ticket', function createTicket(ctx) {
		const { managerId } = ctx.request.body;
		const manager = Model.Manager.findOne({ where: { id: managerId } });

		if (!manager) {
			return ctx.throw(400, 'The manageId is INVALID.');
		}

		ctx.body = { key: Ticket.request(managerId) };
	});
});
