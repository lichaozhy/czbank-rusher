const { Router } = require('@produck/duck-web-koa-router');

module.exports = Router(function CZBankRusherManagerPreviewRouter(router, {
	Model, Resource
}) {
	router.get('/', async function getManagerPreviewList(ctx) {
		const { dateAs } = ctx.query;

		const list = await Model.Manager.findAll({
			include: [{
				model: Model.ManagerData,
				require: false,
				include: [
					{ model: Model.ManagerContribution },
					{
						model: Model.File,
						include: [{
							model: Model.Plan,
							where: dateAs ? { dateAs } : {},
							required: true
						}],
						required: true
					}
				]
			}]
		});

		ctx.body = list.map(manager => Resource.ManagerPreview(manager));
	});
});
