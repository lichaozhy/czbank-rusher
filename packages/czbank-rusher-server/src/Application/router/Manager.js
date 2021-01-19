const { Router } = require('@produck/duck-web-koa-router');

const Resource = {
	Manager(data) {
		return {
			id: data.id,
			name: data.name,
			code: data.code
		};
	}
};

module.exports = Router(function CZBankRusherManagerRouter(router, {
	Sequelize, Utils
}) {
	const Manager = Sequelize.model('Manager');

	router.get('/', async function getManagerList(ctx) {
		const list = await Manager.findAll();

		ctx.body = list.map(data => Resource.Manager(data));
	}).post('/', async function createManager(ctx) {
		const { name, code } = ctx.request.body;
		const id = Utils.encodeSHA256(`${name}-${code}`);
		const data = await Manager.create({ id, name, code });

		ctx.body = Resource.Manager(data);
	}).param('managerId', async function getManager(id, ctx, next) {
		const manager = await Manager.findOne({
			where: { id }
		});

		if (!manager) {
			return ctx.throw(404);
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
	});
});
