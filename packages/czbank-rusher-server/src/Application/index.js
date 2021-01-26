const DuckWebKoa = require('@produck/duck-web-koa');
const DuckWebKoaRouter = require('@produck/duck-web-koa-router');
const koaBody = require('koa-body');
const ResourcePlugin = require('./ResourcePlugin');
const serve = require('koa-static');
const path = require('path');

const Router = require('./router');

module.exports = DuckWebKoa(function CZBankRusherApplication(app, {
	AppRouter, Workspace, injection
}) {
	const bodyparser = koaBody({
		multipart: true,
		formidable: {
			uploadDir: Workspace.getPath('temp')
		}
	});

	app
		.use(serve(path.resolve('www')))
		.use(bodyparser)
		.use(AppRouter().routes());
}, {
	plugins: [
		ResourcePlugin(),
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
					Router: Router.ManagerRouter,
					use: [
						{
							prefix: '/:managerId/file',
							Router: Router.ManagerFileRouter
						},
						{
							prefix: '/:managerId/customer',
							Router: Router.ManagerCustomerRouter
						}
					]
				},
				{
					prefix: '/product',
					Router: Router.ProductRouter
				}
			]
		})
	]
});
