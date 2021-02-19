module.exports = function AccountDataFile(fileData) {
	const { Plan: plan, Manager: manager } = fileData;

	return {
		id: fileData.id,
		createdAt: fileData.createdAt,
		description: fileData.description,
		size: fileData.size,
		customerNumber: fileData.customerNumber,
		accountNumber: fileData.accountNumber,
		plan: {
			id: plan.id,
			name: plan.name,
			dateAs: plan.dateAs
		},
		manager: {
			id: manager.id,
			name: manager.name
		}
	};
};
