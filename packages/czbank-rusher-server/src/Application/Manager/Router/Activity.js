const { Router } = require('@produck/duck-web-koa-router');

module.exports = Router(function CZBankManagerActivity(router, {
	Model, AccessControl: $AC
}) {
	router.get('/', $AC('activity.query'), async ctx => {

	}).get('/:activityId', $AC('activity.get'), async ctx => {

	}).post('/reward', $AC('activity.reward'), async ctx => {

	});
});
