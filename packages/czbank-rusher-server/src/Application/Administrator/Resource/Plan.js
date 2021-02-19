module.exports = function Plan(planData) {
	return {
		id: planData.id,
		name: planData.name,
		description: planData.description,
		dateAs: planData.dateAs,
		fileNumber: planData.Files.length,
		createdAt: planData.createdAt
	};
};
