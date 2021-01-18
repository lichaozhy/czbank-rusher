module.exports = function CZBankRusherAPIRouter(router, {
	product
}) {
	router.get('/meta', function getServiceMeta(ctx) {
		ctx.body = product;
	});
};
