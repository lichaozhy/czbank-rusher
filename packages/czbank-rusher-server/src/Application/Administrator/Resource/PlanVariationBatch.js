module.exports = function PlanBatch(data) {
	const batch = data;
	const { basePlan, targetPlan } = batch;

	return {
		id: batch.id,
		description: batch.description,
		customerCount: batch.customerCount,
		point: batch.point,
		createdAt: batch.createdAt,
		plan: {
			base: {
				id: basePlan.id,
				name: basePlan.name,
				dateAs: basePlan.dateAs
			},
			target: {
				id: targetPlan.id,
				name: targetPlan.name,
				dateAs: targetPlan.dateAs
			}
		}
	};
};
