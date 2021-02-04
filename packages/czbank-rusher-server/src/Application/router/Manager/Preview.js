const { Router } = require('@produck/duck-web-koa-router');

module.exports = Router(function CZBankRusherManagerPreviewRouter(router, {
	Model, Resource
}) {
	router.get('/', async function getManagerPreviewList(ctx) {
		const list = await Model.Manager.findAll({
			include: [{
				model: Model.ManagerData,
				require: false,
				include: [
					{ model: Model.ManagerContribution },
					{ model: Model.File, include: [{ model: Model.Plan }] }
				]
			}]
		});

		ctx.body = list.map(manager => Resource.ManagerPreview(manager));
	});
});
