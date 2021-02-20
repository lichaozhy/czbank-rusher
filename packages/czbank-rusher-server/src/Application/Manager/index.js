const DuckWebKoa = require('@produck/duck-web-koa');
const DuckWebKoaRouter = require('@produck/duck-web-koa-router');
const DuckWebKoaAcl = require('@produck/duck-web-koa-acl');
const koaBody = require('koa-body');
const serve = require('koa-static');
const	KoaSession = require('koa-session');
const path = require('path');
const Router = require('./Router');

module.exports = DuckWebKoa(function CZBankRusherApplication(app, {
	AppRouter
}) {
	app.keys = [Math.random().toString(16).substr(2, 8)];

	app
		.use(serve(path.resolve('www/manager')))
		.use(KoaSession(app))
		.use(koaBody())
		.use(AppRouter().routes());
}, {
	plugins: [
		DuckWebKoaAcl({
			asserts: [
				function authenticated(ctx) {
					return Boolean(ctx.session.managerId);
				},
				function unauthenticated(ctx) {
					return !ctx.session.managerId;
				}
			],
			table: {
				'principal.authenticate': 			[0, 1],
				'manager.get': 									[1, 0],
				'activity.query': 							[1, 0],
				'activity.get': 								[1, 0],
				'activity.reward': 							[1, 0],
				'present.query': 								[1, 0],
				'present.get': 									[1, 0],
				'present.exchange': 						[1, 0],
				'customer.query': 							[1, 0],
				'customer.get': 								[1, 0],
				'performance.query': 						[1, 0],
			}
		}),
		DuckWebKoaRouter({
			prefix: '/api',
			Router: Router.Api,
			use: [
				{
					prefix: '/principal',
					Router: Router.Principal
				},
				{
					prefix: '/customer',
					Router: Router.Customer
				},
				{
					prefix: '/present',
					Router: Router.Present
				},
				{
					prefix: '/manager',
					Router: Router.Manager
				},
				{
					prefix: '/activity',
					Router: Router.Activity
				}
			]
		})
	]
});
