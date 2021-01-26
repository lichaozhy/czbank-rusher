const { Router } = require('@produck/duck-web-koa-router');

module.exports = Router(function CZBankRusherManagerFileRouter(router, {
	Sequelize, Resource
}) {
	router.get('/', async function hello(ctx) {
		const { manager } = ctx.state;
		const fileList = manager.AccountDataFiles;

		ctx.body = fileList.map(file => {
			return Resource.AccountDataFile(file, manager, file.AccountDataPlan);
		});
	});
});
