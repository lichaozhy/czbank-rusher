const { Router } = require('@produck/duck-web-koa-router');

module.exports = Router(function CZBankRusherManagerRouter(router, {
	Sequelize, Utils, Resource
}) {
	const Model = {
		Manager: Sequelize.model('Manager'),
	};

	router.get('/', async function getManagerList(ctx) {

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
	});
});
