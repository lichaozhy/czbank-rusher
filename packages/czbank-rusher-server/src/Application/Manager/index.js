const DuckWebKoa = require('@produck/duck-web-koa');
const DuckWebKoaRouter = require('@produck/duck-web-koa-router');
const koaBody = require('koa-body');
const serve = require('koa-static');
const path = require('path');
const Router = require('./Router');

module.exports = DuckWebKoa(function CZBankRusherApplication(app, {
	AppRouter
}) {
	app
		.use(serve(path.resolve('www/manager')))
		.use(koaBody())
		.use(AppRouter().routes());
}, {
	plugins: [
		DuckWebKoaRouter({
			prefix: '/api',
			Router: Router.Api
		})
	]
});
