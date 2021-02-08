module.exports = function Activity(activity) {
	return {
		id: activity.id,
		name: activity.name,
		startedAt: activity.startedAt,
		endedAt: activity.endedAt,
		participation: activity.CustomerPointAdjustmentByActivities.length,
		description: activity.description,
		createdAt: activity.createdAt,
		updatedAt: activity.updatedAt
	};
};
