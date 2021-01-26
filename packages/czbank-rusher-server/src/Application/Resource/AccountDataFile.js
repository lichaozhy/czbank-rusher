module.exports = function AccountDataFile(file, manager, plan) {
	return {
		id: file.id,
		createdAt: file.createdAt,
		description: file.description,
		size: file.size,
		customerNumber: file.customerNumber,
		accountNumber: file.accountNumber,
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
