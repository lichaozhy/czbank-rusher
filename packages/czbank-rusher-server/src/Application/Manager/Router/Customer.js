const { Router } = require('@produck/duck-web-koa-router');

module.exports = Router(function CZBankManagerCustomer(router, {
	Model, AccessControl: $AC
}) {
	router.get('/', $AC('customer.query'), async ctx => {

	}).get('/:customerId', $AC('customer.get'), async ctx => {

	}).get('/performance', $AC('performance.query'), async ctx => {

	});
});
