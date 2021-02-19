const { Router } = require('@produck/duck-web-koa-router');

module.exports = Router(function CZBankRusherAccountDataPlanRouter(router, {
	Sequelize, Utils, Resource
}) {
	const File = Sequelize.model('File');
	const Plan = Sequelize.model('Plan');

	function BaseQueryOptions(options = {}) {
		return Object.assign(options, { include: [{ model: File }] });
	}

	router.get('/', async function getPlanList(ctx) {
		const list = await Plan.findAll(BaseQueryOptions());

		ctx.body = list.map(plan => Resource.Plan(plan));
	}).post('/', async function createPlan(ctx) {
		const { name, description, dateAs, setting } = ctx.request.body;
		const id = Utils.encodeSHA256(`${dateAs}${Date.now()}`);

		await Plan.create({
			id,
			name, description,
			dateAs: new Date(dateAs),
			setting: JSON.stringify(setting),
			createdAt: new Date()
		});

		const planData = await Plan.findOne(BaseQueryOptions({ where: { id } }));

		ctx.body = Resource.Plan(planData);
	}).param('planId', async function getPlan(id, ctx, next) {
		const plan = await Plan.findOne(BaseQueryOptions({ where: { id } }));

		if (!plan) {
			return ctx.throw(404, 'The plan is NOT existed.');
		}

		ctx.state.plan = plan;

		return next();
	}).get('/:planId', async function getPlan(ctx) {
		const { plan } = ctx.state;

		ctx.body = await Resource.Plan(plan);
	}).put('/:planId', async function updatePlan(ctx) {
		const { name, description, dateAs } = ctx.request.body;
		const { plan } = ctx.state;

		if (name) {
			plan.name = name;
		}

		if (description) {
			plan.description = description;
		}

		if (dateAs) {
			plan.dateAs = new Date(dateAs);
		}

		await plan.save();
		ctx.body = await Resource.Plan(plan);
	}).delete('/:planId', async function deletePlan(ctx) {
		const { plan } = ctx.state;

		if (plan.Files.length > 0) {
			return ctx.throw(423, 'The plan is in use.');
		}

		await plan.destroy();
		ctx.body = await Resource.Plan(plan);
	});
});
