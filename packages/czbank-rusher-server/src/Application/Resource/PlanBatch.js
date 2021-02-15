module.exports = function PlanBatch(data) {
	const batch = data;

	return {
		id: batch.id,
		description: batch.description,
		customerCount: batch.customerCount,
		point: batch.point,
		dateAs: batch.Plan.dateAs,
		createdAt: batch.createdAt,
	};
};
