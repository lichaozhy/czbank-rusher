const DuckWebKoa = require('@produck/duck-web-koa');
const Bodyparser = require('koa-bodyparser');

module.exports = DuckWebKoa(function CZBankRusherApplication(app, {

}) {
	app
		.use(Bodyparser())
});
