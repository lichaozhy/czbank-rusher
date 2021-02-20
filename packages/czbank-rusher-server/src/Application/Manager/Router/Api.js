const { Router } = require('@produck/duck-web-koa-router');

module.exports = Router(function CZBankManagerAPIRouter(router, {
	product
}) {
	router.get('/meta', function getServiceMeta(ctx) {
		ctx.body = product;
	});
});
