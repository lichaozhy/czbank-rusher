const { Router } = require('@produck/duck-web-koa-router');

module.exports = Router(function CZBankManagerPrincipal(router, {
	Model, AccessControl: $AC, Ticket
}) {
	router.get('/:token', $AC('principal.authenticate'), async (ctx) => {
		const { token } = ctx.params;
		const managerId = Ticket.get(token);

		if (managerId === null) {
			throw new Error('Invalid token');
		}

		const manager = await Model.Manager.findOne({ where: { id: managerId } });

		if (!manager) {
			throw new Error('Manager ID invalid.');
		}

		ctx.session.managerId = manager.id;
		ctx.redirect('/');
	}).delete('/', async function signout(ctx) {
		const { managerId } = ctx.session;

		ctx.session.managerId = null;
		ctx.body = { managerId };
	})
});
