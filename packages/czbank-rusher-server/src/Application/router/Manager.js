const { Router } = require('@produck/duck-web-koa-router');

module.exports = Router(function CZBankRusherManagerRouter(router, {
	Model, Utils, Resource
}) {
	router.get('/', async function getManagerList(ctx) {
		const list = await Model.Manager.findAll();

		ctx.body = list.map(manager => Resource.Manager(manager));
	}).post('/', async function createManager(ctx) {
		const { name, code } = ctx.request.body;

		const existed = await Model.Manager.findOne({ where: { code } });

		if (existed) {
			return ctx.throw(400, `A manager code=${code} has been existed.`);
		}

		const id = Utils.encodeSHA256(`${name}-${Date.now()}`);
		const manager = await Model.Manager.create({ id, name, code });

		ctx.body = Resource.Manager(manager);
	}).param('managerId', async function fetchManager(id, ctx, next) {
		const manager = await Model.Manager.findOne({ where: { id } });

		if (!manager) {
			return ctx.throw(404, 'The manager is NOT existed.');
		}

		ctx.state.manager = manager;

		return next();
	}).get('/:managerId', async function getManager(ctx) {
		ctx.body = Resource.Manager(ctx.state.manager);
	}).put('/:managerId', async function updateManager(ctx) {
		const { name, code } = ctx.request.body;
		const { manager } = ctx.state;

		if (name) {
			manager.name = name;
		}

		if (code) {
			manager.code = code;
		}

		manager.save();
		ctx.body = Resource.Manager(manager);
	}).delete('/:managerId', async function deleteManager(ctx) {
		const { manager } = ctx.state;

		manager.destroy();
		ctx.body = Resource.Manager(manager);
	}).get('/:managerId/performance', async function getManagerPerformanceList(ctx) {
		const { manager } = ctx.state;

		const list = await Model.ManagerData.findAll({
			where: { managerId: manager.id },
			include: [
				{ model: Model.Manager },
				{ model: Model.ManagerContribution },
				{ model: Model.File, include: [{ model: Model.Plan }, Model.CustomerData] }
			]
		});

		ctx.body = list.map(manager => Resource.ManagerPerformance(manager));
	}).get('/:managerId/file', async function getManagerFileList(ctx) {
		const { manager } = ctx.state;

		const list = await Model.File.findAll({
			where: { managerId: manager.id },
			include: [Model.Manager, Model.Plan]
		});

		ctx.body = list.map(file => Resource.File(file));
	});
});
