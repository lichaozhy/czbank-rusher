const DuckWebKoa = require('@produck/duck-web-koa');
const DuckWebKoaRouter = require('@produck/duck-web-koa-router');
const Bodyparser = require('koa-bodyparser');

const Router = require('./router');

module.exports = DuckWebKoa(function CZBankRusherApplication(app, {
	AppRouter
}) {
	app
		.use(Bodyparser())
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
					prefix: '/manager',
					Router: Router.ManagerRouter
				},
				{
					prefix: '/product',
					Router: Router.Product
				}
			]
		})
	]
});
