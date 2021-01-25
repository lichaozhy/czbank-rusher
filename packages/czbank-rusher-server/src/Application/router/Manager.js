const { Router } = require('@produck/duck-web-koa-router');

const Resource = {
	Manager(data) {
		data.AccountDataFiles.sort((fileA, fileB) => {
			return fileA.AccountDataPlan.dateAs - fileB.AccountDataPlan.dateAs;
		});

		const file = data.AccountDataFiles[0]

		return {
			id: data.id,
			name: data.name,
			code: data.code,
			customerNumber: data.Customers.length,
			lastUploadedDateAs: file ? file.AccountDataPlan.dateAs : null
		};
	}
};

module.exports = Router(function CZBankRusherManagerRouter(router, {
	Sequelize, Utils
}) {
	const Manager = Sequelize.model('Manager');
	const Customer = Sequelize.model('Customer');
	const AccountDataFile = Sequelize.model('AccountDataFile');
	const AccountDataPlan = Sequelize.model('AccountDataPlan');

	function BaseOptions() {
		return {
			include: [
				{ model: Customer },
				{
					model: AccountDataFile,
					include: [AccountDataPlan]
				}
			]
		};
	}

	router.get('/', async function getManagerList(ctx) {
		const list = await Manager.findAll(BaseOptions());

		ctx.body = list.map(Resource.Manager);
	}).post('/', async function createManager(ctx) {
		const { name, code } = ctx.request.body;
		const id = Utils.encodeSHA256(`${name}-${code}`);
		const data = await Manager.create({ id, name, code }, BaseOptions());

		ctx.body = Resource.Manager(data);
	}).param('managerId', async function getManager(id, ctx, next) {
		const options = BaseOptions();

		options.where = { id };

		const manager = await Manager.findOne(options);

		if (!manager) {
			return ctx.throw(404, 'The manager is NOT existed.');
		}

		ctx.state.manager = manager;

		return next();
	}).get('/:managerId', async function getManager(ctx) {
		const { manager } = ctx.state;

		ctx.body = Resource.Manager(manager);
	}).put('/:managerId', async function updateManager(ctx) {
		const { name, code } = ctx.request.body;
		const { manager } = ctx.state;

		if (name) {
			manager.name = name;
		}

		if (code) {
			manager.code = code;
		}

		await manager.save();

		ctx.body = Resource.Manager(manager);
	}).delete('/:managerId', async function deleteManager(ctx) {
		const { manager } = ctx.state;

		await manager.destroy();

		ctx.body = Resource.Manager(manager);
	});
});
