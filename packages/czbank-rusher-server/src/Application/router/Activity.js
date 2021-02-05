const { Router } = require('@produck/duck-web-koa-router');

module.exports = Router(function CZBRusherActivityRouter(router, {
	Model, Resource, Utils
}) {
	function QueryOptions(id) {
		const options = { include: [Model.CustomerPointAdjustmentByActivity] };

		if (id) {
			options.where = {id};
		}

		return options;
	}

	async function ensureNotUsed(ctx, next) {
		const { activity } = ctx.state;

		if (activity.CustomerPointAdjustmentByActivities.length > 0) {
			return ctx.throw(403, 'This activity has been used.');
		}

		return next();
	}

	router.get('/', async function getActivityList(ctx) {
		const list = await Model.Activity.findAll(QueryOptions());

		ctx.body = list.map(activity => Resource.Activity(activity));
	}).post('/', async function createActivity(ctx) {
		const { name, description = '', startedAt, endedAt } = ctx.request.body;
		const id = Utils.encodeSHA256(`activity-${Date.now}-name`);

		await Model.Activity.create({
			id, name, description,
			startedAt: new Date(startedAt),
			endedAt: endedAt ? new Date(endedAt) : null,
			createdAt: new Date(),
			updatedAt: new Date()
		});

		const activity = await Model.Activity.findOne(QueryOptions(id));

		ctx.body = Resource.Activity(activity);
	}).param('activity', async function fetchActivity(id, ctx, next) {
		const activity = await Model.Activity.findOne(QueryOptions(id));

		if (!activity) {
			return ctx.throw(404);
		}

		ctx.state.activity = activity;

		return next();
	}).get('/:activityId', async function getActivity(ctx) {
		ctx.body = Resource.Activity(ctx.state.activity);
	}).put('/:activityId', ensureNotUsed, async function updateActivity(ctx) {
		const { activity } = ctx.state;
		const { name, description, startedAt, endedAt } = ctx.request.body;

		if (name) {
			activity.name = name;
		}

		if (description) {
			activity.description = description;
		}

		if (startedAt) {
			activity.startedAt = new Date(startedAt);
		}

		if (endedAt) {
			activity.endedAt = new Date(endedAt);
		}

		activity.updatedAt = new Date();
		await activity.save();
		ctx.body = Resource.Activity(activity);
	}).put('/:activityId/endedAt', async function delayActivity(ctx) {
		const { activity } = ctx.state;
		const { value } = ctx.request.body;
		const endedAt = new Date(value);

		if (endedAt < activity.startedAt) {
			return ctx.throw(400, '`endedAt` of a activity MUST be later than `startedAt`');
		}

		activity.endedAt = endedAt;
		await activity.save();
		ctx.body = { value: endedAt };
	}).delete('/:activityId', ensureNotUsed, async function deleteActivity(ctx) {
		const { activity } = ctx.state;

		await activity.destroy();

		ctx.body = Resource.Activity(activity);
	});
});
