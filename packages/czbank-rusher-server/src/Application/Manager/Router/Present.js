const { Router } = require('@produck/duck-web-koa-router');

module.exports = Router(function CZBankManagerPresent(router, {
	Model, AccessControl: $AC
}) {
	router.get('/', $AC('present.query'), async ctx => {

	}).get('/:presentId', $AC('present.get'), async ctx => {

	}).post('/exchange', $AC('present.exchange'), async ctx => {

	});
});
