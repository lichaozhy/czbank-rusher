const { Router } = require('@produck/duck-web-koa-router');

module.exports = Router(function CZBankRusherAccountDataPlanRouter(router, {
	Sequelize, Utils
}) {
	const AccountDataFile = Sequelize.model('AccountDataFile');
	const AccountDataPlan = Sequelize.model('AccountDataPlan');
	const Product = Sequelize.model('Product');
	const ProductAccountDataSetting = Sequelize.model('ProductAccountDataSetting');

	const Resource = {
		async AccountDataPlan(planData) {
			return {
				id: planData.id,
				name: planData.name,
				description: planData.description,
				dateAs: planData.dateAs,
				fileNumber: await planData.countAccountDataFiles(),
				createdAt: planData.createdAt
			};
		},
		AccountDataPlanResult() {
			return {

			};
		}
	};

	async function PlanSetting() {
		const list = await Product.findAll({
			include: [ProductAccountDataSetting]
		});

		const setting = list.map(product => {
			return {
				name: product.name,
				code: product.code,
				balance: product.ProductAccountDataSetting.fieldIndexOfBalance,
				averageDeposit: product.ProductAccountDataSetting.fieldIndexOfAverageDeposit
			};
		});

		return JSON.stringify(setting);
	}

	function BaseQueryOptions() {
		return {
			include: [{
				model: AccountDataFile,
				attributes: []
			}]
		};
	}

	router.get('/', async function getPlanList(ctx) {
		const list = await AccountDataPlan.findAll(BaseQueryOptions());

		ctx.body = await Promise.all(list.map(plan => Resource.AccountDataPlan(plan)));
	}).post('/', async function createPlan(ctx) {
		const { name, description, dateAs } = ctx.request.body;

		const data = await AccountDataPlan.create({
			id: Utils.encodeSHA256(`${name}${dateAs}${Date.now()}`),
			name, description,
			dateAs: new Date(dateAs),
			setting: await PlanSetting(),
			createdAt: new Date()
		}, BaseQueryOptions());

		ctx.body = await Resource.AccountDataPlan(data);
	}).param('planId', async function getPlan(id, ctx, next) {
		const options = BaseQueryOptions();

		options.where = { id };

		const plan = await AccountDataPlan.findOne(options);

		if (!plan) {
			return ctx.throw(404, 'The plan is NOT existed.');
		}

		ctx.state.plan = plan;

		return next();
	}).get('/:planId', async function getPlan(ctx) {
		const { plan } = ctx.state;

		ctx.body = await Resource.AccountDataPlan(plan);
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

		ctx.body = await Resource.AccountDataPlan(plan);
	}).delete('/:planId', async function deletePlan(ctx) {
		const { plan } = ctx.state;

		await plan.destroy();

		ctx.body = await Resource.AccountDataPlan(plan);
	});
});
