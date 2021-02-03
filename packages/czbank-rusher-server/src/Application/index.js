const DuckWebKoa = require('@produck/duck-web-koa');
const DuckWebKoaRouter = require('@produck/duck-web-koa-router');
const koaBody = require('koa-body');
const ResourcePlugin = require('./ResourcePlugin');
const serve = require('koa-static');
const path = require('path');

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
		.use(serve(path.resolve('www')))
		.use(bodyparser)
		.use(AppRouter().routes());
}, {
	plugins: [
		ResourcePlugin(),
		DuckWebKoaRouter({
			prefix: '/api',
			Router: Router.Api,
			use: [
				{
					prefix: '/account',
					Router: Router.Account
				},
				{
					prefix: '/account/data',
					Router: Router.AccountData
				},
				{
					prefix: '/account/data/plan',
					Router: Router.AccountDataPlan
				},
				{
					prefix: '/account/data/file',
					Router: Router.AccountDataFile
				},
				{
					prefix: '/manager',
					Router: Router.Manager,
					use: [
						{
							prefix: '/performance',
							Router: Router.ManagerPerformance
						},
						{
							prefix: '/:managerId/file',
							Router: Router.ManagerFile
						},
						{
							prefix: '/:managerId/customer',
							Router: Router.ManagerCustomer
						}
					]
				},
				{
					prefix: '/product',
					Router: Router.Product
				},
				{
					prefix: '/customer',
					Router: Router.Customer
				}
			]
		})
	]
});
