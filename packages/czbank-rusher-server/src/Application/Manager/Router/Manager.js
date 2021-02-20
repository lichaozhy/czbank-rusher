const { Router } = require('@produck/duck-web-koa-router');

module.exports = Router(function CZBankManagerProfile(router, {
	Model, AccessControl: $AC
}) {
	function Manager(manager) {
		return {
			id: manager.id,
			name: manager.name,
			code: manager.code
		};
	};

	router.get('/', $AC('manager.get'), async ctx => {
		const { managerId } = ctx.session;
		const manager = await Model.Manager.findOne({
			where: { id: managerId }
		});

		ctx.body = Manager(manager);
	}).get('/performance', $AC('manager.get'), async ctx => {

	});
});
