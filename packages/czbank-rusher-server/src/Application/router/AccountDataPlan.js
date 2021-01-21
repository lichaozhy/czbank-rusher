const { Router } = require('@produck/duck-web-koa-router');

module.exports = Router(function CZBankRusherAPIRouter(router, {
	Sequelize, Utils,
}) {
	const AccountDataPlan = Sequelize.model('AccountDataPlan');
	const AccountData = Sequelize.model('AccountData');

	const Resource = {
		AccountDataPlan(planData) {
			return {
				id: planData.id,
				name: planData.name,
				description: planData.description,
				dateAs: planData.dateAs,
				setting: planData.setting,
				resolved: planData.resolved,
				createdAt: planData.createdAt
			};
		},
		AccountDataPlanResult() {
			return {

			}
		}
	};

	router.get('/', async function getPlanList(ctx) {
		const list = await AccountDataPlan.findAll();

		ctx.body = list.map(plan => Resource.AccountDataPlan(plan));
	}).post('/', async function createPlan(ctx) {
		const { name, description, dateAs } = ctx.request.body;

		const data = await AccountDataPlan.create({
			id: Utils.encodeSHA256(`${name}${dateAs}${Date.now()}`),
			name, description,
			dateAs: new Date(dateAs),
			setting: '',
			resolved: false,
			createdAt: new Date()
		});

		ctx.body = Resource.AccountDataPlan(data);
	}).param('planId', async function getPlan(id, ctx, next) {
		const plan = await AccountDataPlan.findOne({ where: { id } });

		if (!plan) {
			return ctx.throw(404, 'The plan is NOT existed.');
		}

		ctx.state.plan = plan;

		return next();
	}).get('/:planId', async function getPlan(ctx) {
		const { plan } = ctx.state;

		ctx.body = Resource.AccountDataPlan(plan);
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

		ctx.body = Resource.AccountDataPlan(plan);
	}).delete('/:planId', async function deletePlan(ctx) {
		const { plan } = ctx.state;

		await plan.destroy();

		ctx.body = Resource.AccountDataPlan(plan);
	}).post('/:planId/account/data', async function writeAllAccountData(ctx) {
		const { plan } = ctx.state;

		plan.resolved = true;
		await plan.save();

		ctx.body = {}
	});
});
