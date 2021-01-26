const { Router } = require('@produck/duck-web-koa-router');

module.exports = Router(function CZBankRusherManagerRouter(router, {
	Sequelize, Utils, Resource
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
		const list = await Manager.findAll({
			include: [
				{
					model: AccountDataFile,
					include: [{
						model: AccountDataPlan,
					}],
					// limit: 1,
					separate: true,
					required: false,
					order: [
						[AccountDataPlan, 'dateAs', 'DESC']
					]
				},
			],
		});

		ctx.body = list.map(manager => {
			const file = manager.AccountDataFiles[0];

			return {
				id: manager.id,
				name: manager.name,
				code: manager.code,
				customerNumber: file ? file.customerNumber : 0,
				abstract: file ? JSON.parse(file.abstract) : {},
				lastUploadedDateAs: file ? file.AccountDataPlan.dateAs : null
			};
		});
	}).post('/', async function createManager(ctx) {
		const { name, code } = ctx.request.body;
		const id = Utils.encodeSHA256(`${name}-${code}`);
		const manager = await Manager.create({ id, name, code });

		ctx.body = Resource.Manager(manager, [], []);
	}).param('managerId', async function getManager(id, ctx, next) {
		const options = BaseOptions();

		options.where = { id };

		const manager = await Manager.findOne(options);

		if (!manager) {
			return ctx.throw(404, 'The manager is NOT existed.');
		}

		ctx.state.manager = manager;
		ctx.state.customerList = manager.Customers;
		ctx.state.fileList = manager.AccountDataFiles;

		return next();
	}).get('/:managerId', async function getManager(ctx) {
		const { manager, customerList, fileList } = ctx.state;

		ctx.body = Resource.Manager(manager, customerList, fileList);
	}).put('/:managerId', async function updateManager(ctx) {
		const { name, code } = ctx.request.body;
		const { manager, customerList, fileList } = ctx.state;

		if (name) {
			manager.name = name;
		}

		if (code) {
			manager.code = code;
		}

		manager.save();

		ctx.body = Resource.Manager(manager, customerList, fileList);
	}).delete('/:managerId', async function deleteManager(ctx) {
		const { manager, customerList, fileList } = ctx.state;

		manager.destroy();

		ctx.body = Resource.Manager(manager, customerList, fileList);
	});
});
