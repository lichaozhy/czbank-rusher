const { Router } = require('@produck/duck-web-koa-router');

module.exports = Router(function CZBankManagerPrincipal(router, {
	Model, AccessControl: $AC
}) {
	router.get('/:token', $AC('principal.authenticate'), async (ctx, next) => {
		const { token } = ctx.params;
		const manager = await Model.Manager.findOne();

		ctx.session.managerId = manager.id;

		return next();
	}).delete('/', async function signout(ctx, next) {
		ctx.session.managerId = null;

		return next();
	}).use(function navigateToClient(ctx) {
		ctx.redirect('/');
	});
});
