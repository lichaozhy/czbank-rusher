const DuckWebKoa = require('@produck/duck-web-koa');
const DuckWebKoaRouter = require('@produck/duck-web-koa-router');
const koaBody = require('koa-body');

const Router = require('./router');

module.exports = DuckWebKoa(function CZBankRusherApplication(app, {
	AppRouter, Workspace
}) {
	const bodyparser = koaBody({
		multipart: true,
		formidable: {
			uploadDir: Workspace.getPath('temp')
		}
	});

	app
		.use(bodyparser)
		.use(AppRouter().routes());
}, {
	plugins: [
		DuckWebKoaRouter({
			prefix: '/api',
			Router: Router.ApiRouter,
			use: [
				{
					prefix: '/account',
					Router: Router.AccountRouter
				},
				{
					prefix: '/account/data',
					Router: Router.AccountDataRouter
				},
				{
					prefix: '/account/data/plan',
					Router: Router.AccountDataPlanRouter
				},
				{
					prefix: '/account/data/file',
					Router: Router.AccountDataFileRouter
				},
				{
					prefix: '/manager',
					Router: Router.ManagerRouter
				},
				{
					prefix: '/product',
					Router: Router.ProductRouter
				}
			]
		})
	]
});
