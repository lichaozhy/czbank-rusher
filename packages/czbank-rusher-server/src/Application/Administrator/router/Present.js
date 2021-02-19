const { Router } = require('@produck/duck-web-koa-router');

module.exports = Router(function CZBRusherPresentRouter(router, {
	Model, Resource, Utils
}) {
	function QueryOptions({ id, enabled = null }) {
		const where = {};
		const options = { where, include: [Model.CustomerPointAdjustmentByPresent] };

		if (id) {
			where.id = id;
		}

		if (enabled !== null) {
			where.enabled = true;
		}

		return options;
	}

	async function ensureNotUsed(ctx, next) {
		const { present } = ctx.state;

		if (present.CustomerPointAdjustmentByPresents.length > 0) {
			return ctx.throw(403, 'This present has been used.');
		}

		return next();
	}

	router.get('/', async function getPresentList(ctx) {
		const { enabled } = ctx.query;

		if (enabled !== undefined && enabled !== 'true' && enabled !== 'false') {
			return ctx.throw(400, 'The query parameter `enabled` MUST be `true` or `false`.');
		}

		const list = await Model.Present.findAll(QueryOptions({
			enabled: enabled === undefined ? undefined : enabled === 'true'
		}));

		ctx.body = list.map(present => Resource.Present(present));
	}).post('/', async function createPresent(ctx) {
		const { name, price, point, description } = ctx.request.body;
		const id = Utils.encodeSHA256(`present-${Date.now}-${name}`);
		const now = new Date();

		await Model.Present.create({
			id, name, price, point, description,
			enabled: true,
			createdAt: now,
			updatedAt: now
		});

		const present = await Model.Present.findOne(QueryOptions({ id }));

		ctx.body = Resource.Present(present);
	}).param('presentId', async function fetchPresent(id, ctx, next) {
		const present = await Model.Present.findOne(QueryOptions({ id }));

		if (!present) {
			return ctx.throw(404);
		}

		ctx.state.present = present;

		return next();
	}).get('/:presentId', async function getPresent(ctx) {
		ctx.body = Resource.Present(ctx.state.present);
	}).put('/:presentId', ensureNotUsed, async function updatePresent(ctx) {
		const { present } = ctx.state;
		const { name, price, point, description } = ctx.request.body;

		if (name) {
			present.name = name;
		}

		if (price) {
			present.price = price;
		}

		if (point) {
			present.point = point;
		}

		if (description) {
			present.description = description;
		}

		present.updatedAt = new Date();
		await present.save();
		ctx.body = Resource.Present(present);
	}).delete('/:presentId', ensureNotUsed, async function deletePresent(ctx) {
		const { present } = ctx.state;

		await present.destroy();
		ctx.body = Resource.Present(present);
	}).put('/:presentId/enabled', async function setPresentUsability(ctx) {
		const { present } = ctx.state;
		const { value } = ctx.request.body;
		const enabled = Boolean(value);

		present.enabled = enabled;
		present.updatedAt = new Date();
		await present.save();
		ctx.body = { value: enabled };
	});
});
