const { Router } = require('@produck/duck-web-koa-router');

module.exports = Router(function CZBankManagerPrincipal(router, {
	Model, AccessControl: $AC
}) {
	router.get('/:token', $AC('principal.authenticate'), async (ctx) => {
		const { token } = ctx.params;
		const manager = await Model.Manager.findOne();

		ctx.session.managerId = manager.id;
		ctx.redirect('/');
	}).delete('/', async function signout(ctx) {
		const { managerId } = ctx.session;

		ctx.session.managerId = null;
		ctx.body = { managerId };
	})
});
