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
					prefix: '/activity',
					Router: Router.Activity
				},
				{
					prefix: '/present',
					Router: Router.Present
				},
				{
					prefix: '/plan',
					Router: Router.Plan
				},
				{
					prefix: '/file',
					Router: Router.File
				},
				{
					prefix: '/manager/preview',
					Router: Router.ManagerPreview
				},
				{
					prefix: '/manager',
					Router: Router.Manager,
					use: [
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
				},
				{
					prefix: '/point',
					Router: Router.Point,
					use: [
						{
							prefix: '/plan',
							Router: Router.PointPlan
						}
					]
				}
			]
		})
	]
});
